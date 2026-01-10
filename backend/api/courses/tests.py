from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Course, CodingExercise
from api.authapi.models import Profile

class CourseTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='instructor', password='password')
        # Ensure user has instructor profile
        Profile.objects.create(user=self.user, role='instructor')

        self.client.force_authenticate(user=self.user)

        self.course = Course.objects.create(
            title="Test Course",
            description="Test Description",
            instructor=self.user
        )

    def test_create_coding_exercise(self):
        url = '/api/courses/exercises/'
        data = {
            "title": "Test Exercise",
            "description": "Solve this",
            "starter_code": "print('hello')",
            "course": self.course.id,
            "test_cases": [{"input": "1", "output": "1"}]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CodingExercise.objects.count(), 1)

    def test_execute_code(self):
        url = '/api/courses/execute/'
        data = {
            "code": "print('Hello World')",
            "language": "python"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Hello World", response.data['output'])
