from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, MFASetupView, MFADisableView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('mfa/setup/', MFASetupView.as_view(), name='mfa_setup'),
    path('mfa/disable/', MFADisableView.as_view(), name='mfa_disable'),
]
