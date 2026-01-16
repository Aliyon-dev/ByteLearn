from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgressViewSet, LessonCompletionViewSet, CodingExerciseSubmissionViewSet

router = DefaultRouter()
router.register(r'', ProgressViewSet, basename='progress')
router.register(r'lesson-completions', LessonCompletionViewSet, basename='lesson-completion')
router.register(r'coding-submissions', CodingExerciseSubmissionViewSet, basename='coding-submission')

urlpatterns = [
    path('', include(router.urls)),
]
