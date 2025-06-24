from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer
from .models import Profile

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

class MFAView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Placeholder for real MFA verification (e.g. code validation)
        profile = request.user.profile
        if profile.mfa_enabled:
            # Verify MFA code sent in request.data['code'] here
            return Response({"detail": "MFA verified"})
        else:
            return Response({"detail": "MFA not enabled"}, status=400)
