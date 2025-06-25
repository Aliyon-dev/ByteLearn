from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from .models import Profile


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Registration successful",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        res = super().post(request, *args, **kwargs)

        if res.status_code == 200:
            try:
                data = res.data
                username = request.data.get("username")

                if not username:
                    return Response({
                        "message": "Username is required"
                    }, status=status.HTTP_400_BAD_REQUEST)

                user = User.objects.get(username=username)

                access = data.get("access")if data else None
                refresh = data.get("refresh")if data else None

                return Response({
                    "message": "Login successful",
                    "access": access,
                    "refresh": refresh,
                    "user": {
                        "username": user.username,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "role": getattr(getattr(user, 'profile', None), 'role', None),
                    }
                }, status=status.HTTP_200_OK)

            except User.DoesNotExist:
                return Response({
                    "message": "User not found"
                }, status=status.HTTP_404_NOT_FOUND)

            except Exception as e:
                return Response({
                    "message": "An error occurred",
                    "error": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": "Invalid credentials"
        }, status=status.HTTP_401_UNAUTHORIZED)


class MFAView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        profile = request.user.profile

        if not profile.mfa_enabled:
            return Response(
                {"detail": "MFA not enabled"},
                status=status.HTTP_400_BAD_REQUEST
            )

        code = request.data.get("code")
        if not code:
            return Response(
                {"detail": "MFA code is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Simulated success (replace with real MFA logic)
        if code == "123456":
            return Response({"detail": "MFA verified"}, status=status.HTTP_200_OK)

        return Response(
            {"detail": "Invalid MFA code"},
            status=status.HTTP_401_UNAUTHORIZED
        )
