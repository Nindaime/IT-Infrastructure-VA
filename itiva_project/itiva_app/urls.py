# ==============================================================================
# itiva_project/itiva_app/urls.py
#
# Maps the API views to their URL paths.
# ==============================================================================

from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from django.contrib import admin
from .views import (
    RegisterView, QuestionnaireView, SubmitAssessmentView,
    ResultView, RankingView, MapDataView
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', obtain_auth_token, name='login'), # Built-in token login
    path('questionnaire/', QuestionnaireView.as_view(), name='questionnaire'),
    path('assessment/submit/', SubmitAssessmentView.as_view(), name='submit-assessment'),
    path('results/<int:pk>/', ResultView.as_view(), name='get-result'),
    path('rankings/', RankingView.as_view(), name='rankings'),
    path('admin/map-data/', MapDataView.as_view(), name='map-data'),
]