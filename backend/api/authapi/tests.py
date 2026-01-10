from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Profile
import pyotp

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.mfa_setup_url = '/api/auth/mfa/setup/'

        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "TestPassword123!",
            "password2": "TestPassword123!",
            "first_name": "Test",
            "last_name": "User",
            "studentId": "STU12345"
        }

    def test_registration(self):
        response = self.client.post(self.register_url, self.user_data)
        if response.status_code != 201:
            print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="testuser").exists())
        self.assertTrue(Profile.objects.filter(student_id="STU12345").exists())

    def test_login(self):
        self.client.post(self.register_url, self.user_data)
        response = self.client.post(self.login_url, {
            "username": "testuser",
            "password": "TestPassword123!"
        })
        if response.status_code != 200:
            print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_mfa_flow(self):
        # Register
        self.client.post(self.register_url, self.user_data)

        # Login to get token
        login_res = self.client.post(self.login_url, {
            "username": "testuser",
            "password": "TestPassword123!"
        })
        token = login_res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

        # Setup MFA
        setup_res = self.client.get(self.mfa_setup_url)
        self.assertEqual(setup_res.status_code, status.HTTP_200_OK)
        secret = setup_res.data['secret']

        # Enable MFA
        totp = pyotp.TOTP(secret)
        code = totp.now()
        enable_res = self.client.post(self.mfa_setup_url, {"code": code})
        self.assertEqual(enable_res.status_code, status.HTTP_200_OK)

        # Verify Profile updated
        profile = Profile.objects.get(user__username="testuser")
        self.assertTrue(profile.mfa_enabled)

        # Logout (clear creds)
        self.client.credentials()

        # Login again - should require MFA
        login_res_2 = self.client.post(self.login_url, {
            "username": "testuser",
            "password": "TestPassword123!"
        })
        self.assertEqual(login_res_2.status_code, status.HTTP_200_OK)
        self.assertTrue(login_res_2.data.get('mfa_required'))
        self.assertNotIn('access', login_res_2.data)

        # Login with Code
        login_res_3 = self.client.post(self.login_url, {
            "username": "testuser",
            "password": "TestPassword123!",
            "otp": totp.now()
        })
        self.assertEqual(login_res_3.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_res_3.data)
