from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgressViewSet

router = DefaultRouter()
router.register(r'', ProgressViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
