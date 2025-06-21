# ==============================================================================
# itiva_project/itiva_app/serializers.py
#
# Defines how Django models are converted to and from JSON for the API.
# ==============================================================================

from rest_framework import serializers
from .models import User, Business, Question, Option, VAResult

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ['business_name', 'description', 'website', 'address', 'latitude', 'longitude']

class UserSerializer(serializers.ModelSerializer):
    business = BusinessSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'password', 'business']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        business_data = validated_data.pop('business', None)
        user = User.objects.create_user(**validated_data)
        if business_data:
            Business.objects.create(user=user, **business_data)
        return user

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    class Meta:
        model = Question
        fields = ['id', 'text', 'category', 'options']

class AnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    option_id = serializers.IntegerField()

class AssessmentSubmissionSerializer(serializers.Serializer):
    answers = AnswerSerializer(many=True)
    session_id = serializers.CharField(max_length=100)

class VAResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = VAResult
        fields = '__all__'

class RankingSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source='user.business.business_name')
    location = serializers.CharField(source='user.business.address') # Simplified for now

    class Meta:
        model = VAResult
        fields = ['business_name', 'location', 'overall_score']

class MapDataSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source='user.business.business_name')
    latitude = serializers.DecimalField(source='user.business.latitude', max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(source='user.business.longitude', max_digits=9, decimal_places=6)

    class Meta:
        model = VAResult
        fields = ['business_name', 'latitude', 'longitude', 'overall_score']