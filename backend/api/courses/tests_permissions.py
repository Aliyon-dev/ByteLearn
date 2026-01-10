from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Course, CodingExercise
from .serializers import CourseSerializer

class CoursePermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.instructor = User.objects.create_user(username='instructor', password='password')
        # Create profile explicitly if signals aren't doing it (based on our serializer logic it happens in views/serializers, but here we use models directly)
        from api.authapi.models import Profile
        Profile.objects.create(user=self.instructor, role='instructor')

        self.student = User.objects.create_user(username='student', password='password')
        Profile.objects.create(user=self.student, role='student')

        self.course = Course.objects.create(
            title="Test Course",
            description="Test Description",
            instructor=self.instructor
        )

    def test_student_cannot_create_course(self):
        self.client.force_authenticate(user=self.student)
        url = '/api/courses/courses/'
        data = {
            "title": "Hacked Course",
            "description": "I should not be able to do this",
            "instructor": self.student.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_instructor_can_create_course(self):
        self.client.force_authenticate(user=self.instructor)
        url = '/api/courses/courses/'
        data = {
            "title": "Legit Course",
            "description": "I can do this",
            # Instructor field is set automatically by perform_create but serializer might require it?
            # Usually ReadOnlyField or handled in perform_create.
            # Let's see if serializer allows it or if we need to exclude it from data.
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_code_execution_security(self):
        self.client.force_authenticate(user=self.student)
        url = '/api/courses/execute/'

        # Test 1: Import os
        data = {
            "code": "import os\nprint(os.listdir('.'))",
            "language": "python"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Security violation", str(response.data))

        # Test 2: Valid code
        data = {
            "code": "print('Hello Safe World')",
            "language": "python"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
