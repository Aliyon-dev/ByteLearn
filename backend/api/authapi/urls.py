from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, MFAView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('2fa/verify/', MFAView.as_view(), name='mfa_verify'),
]
