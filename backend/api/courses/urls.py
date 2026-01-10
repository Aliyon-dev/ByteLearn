from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, CodingExerciseViewSet, ExecuteCodeView

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'exercises', CodingExerciseViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('execute/', ExecuteCodeView.as_view(), name='execute-code'),
]
