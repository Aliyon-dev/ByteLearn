from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from .models import Profile
import pyotp
import qrcode
import io
import base64

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()

            # Profile is created/updated in the serializer.
            # We just need to handle the student_id if it wasn't passed to serializer
            # But the serializer expects standard user fields.
            # Ideally we pass everything to serializer context or update serializer.
            # For now, we update the profile here.

            student_id = request.data.get('studentId')
            # role is already handled in serializer

            if student_id and hasattr(user, 'profile'):
                user.profile.student_id = student_id
                user.profile.save()

            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Registration successful",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "username": user.username,
                    "role": user.profile.role
                }
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        res = super().post(request, *args, **kwargs)

        if res.status_code == 200:
            try:
                username = request.data.get("username")
                user = User.objects.get(username=username)
                profile = getattr(user, 'profile', None)

                if profile and profile.mfa_enabled:
                    otp = request.data.get("otp")
                    if not otp:
                        return Response({
                            "mfa_required": True,
                            "message": "MFA code required"
                        }, status=status.HTTP_200_OK)

                    totp = pyotp.TOTP(profile.mfa_secret)
                    if not totp.verify(otp):
                        return Response({
                            "message": "Invalid MFA code"
                        }, status=status.HTTP_401_UNAUTHORIZED)

                data = res.data
                access = data.get("access")
                refresh = data.get("refresh")

                return Response({
                    "message": "Login successful",
                    "access": access,
                    "refresh": refresh,
                    "user": {
                        "username": user.username,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "role": profile.role if profile else None,
                    }
                }, status=status.HTTP_200_OK)

            except User.DoesNotExist:
                return Response({
                    "message": "User not found"
                }, status=status.HTTP_404_NOT_FOUND)

        return res

class MFASetupView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Generate a new MFA secret and QR code"""
        user = request.user
        profile = user.profile

        if profile.mfa_enabled:
            return Response({"message": "MFA is already enabled"}, status=status.HTTP_400_BAD_REQUEST)

        if not profile.mfa_secret:
            profile.mfa_secret = pyotp.random_base32()
            profile.save()

        totp = pyotp.TOTP(profile.mfa_secret)
        provisioning_uri = totp.provisioning_uri(name=user.email, issuer_name="ByteLearn")

        img = qrcode.make(provisioning_uri)
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        return Response({
            "secret": profile.mfa_secret,
            "qr_code": f"data:image/png;base64,{img_str}"
        })

    def post(self, request):
        """Verify the code and enable MFA"""
        user = request.user
        profile = user.profile

        code = request.data.get("code")
        if not code:
            return Response({"message": "Code is required"}, status=status.HTTP_400_BAD_REQUEST)

        if not profile.mfa_secret:
             return Response({"message": "Setup MFA first"}, status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.TOTP(profile.mfa_secret)
        if totp.verify(code):
            profile.mfa_enabled = True
            profile.save()
            return Response({"message": "MFA enabled successfully"})
        else:
            return Response({"message": "Invalid code"}, status=status.HTTP_400_BAD_REQUEST)

class MFADisableView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        profile = user.profile
        profile.mfa_enabled = False
        profile.mfa_secret = None
        profile.save()
        return Response({"message": "MFA disabled"})
