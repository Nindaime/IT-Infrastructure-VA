# ==============================================================================
# itiva_project/itiva_app/views.py
#
# Contains the logic for each API endpoint.
# ==============================================================================

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.db.models import F, Window
from django.db.models.functions import DenseRank
from .models import User, Question, MarkingGrid, UserAnswer, VAResult, Business
from .serializers import (
    UserSerializer, QuestionSerializer, AssessmentSubmissionSerializer,
    VAResultSerializer, RankingSerializer, MapDataSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

class QuestionnaireView(generics.ListAPIView):
    queryset = Question.objects.prefetch_related('options').all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

class SubmitAssessmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = AssessmentSubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        answers = serializer.validated_data['answers']
        session_id = serializer.validated_data['session_id']
        user = request.user

        scores = { 'WS': 0, 'DN': 0, 'CD': 0, 'CS': 0 }
        
        try:
            with transaction.atomic():
                # Clear previous answers for this session if re-submitting
                UserAnswer.objects.filter(user=user, session_id=session_id).delete()
                
                for answer in answers:
                    marking_grid_entry = get_object_or_404(
                        MarkingGrid.objects.select_related('option__question'), 
                        option_id=answer['option_id']
                    )
                    
                    # Save the user's answer
                    UserAnswer.objects.create(
                        user=user,
                        question_id=answer['question_id'],
                        selected_option_id=answer['option_id'],
                        session_id=session_id
                    )
                    
                    # Add to score
                    category = marking_grid_entry.option.question.category
                    scores[category] += marking_grid_entry.score

                overall_score = sum(scores.values())

                # Create or update the result
                va_result, created = VAResult.objects.update_or_create(
                    user=user, session_id=session_id,
                    defaults={
                        'website_score': scores['WS'],
                        'network_score': scores['DN'],
                        'compliance_score': scores['CD'],
                        'cybersec_score': scores['CS'],
                        'overall_score': overall_score,
                    }
                )
                
                result_serializer = VAResultSerializer(va_result)
                return Response(result_serializer.data, status=status.HTTP_201_CREATED)

        except MarkingGrid.DoesNotExist:
            return Response({"error": "Invalid option provided."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResultView(generics.RetrieveAPIView):
    queryset = VAResult.objects.all()
    serializer_class = VAResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return VAResult.objects.filter(user=self.request.user)

class RankingView(generics.ListAPIView):
    """
    Returns the top 10 businesses ranked by their latest assessment score.
    """
    serializer_class = RankingSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # This query gets the latest result for each user and ranks them.
        latest_results = VAResult.objects.distinct('user').order_by('user', '-created_at')
        
        # We need the IDs from this subquery to filter the main queryset
        latest_result_ids = [result.id for result in latest_results]

        queryset = VAResult.objects.filter(id__in=latest_result_ids).order_by('-overall_score')
        
        return queryset[:10]

class MapDataView(generics.ListAPIView):
    """
    For Admins: Returns location and score for all businesses that have results.
    """
    serializer_class = MapDataSerializer
    permission_classes = [permissions.IsAdminUser] # Only admins can see this

    def get_queryset(self):
        # Similar to ranking, get the latest result for each user
        latest_results = VAResult.objects.distinct('user').order_by('user', '-created_at')
        latest_result_ids = [result.id for result in latest_results]
        return VAResult.objects.filter(id__in=latest_result_ids).select_related('user__business')