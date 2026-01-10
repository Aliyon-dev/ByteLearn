from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Assessment
from api.authapi.models import Profile

class AssessmentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='student', password='password')
        Profile.objects.create(user=self.user, role='student')
        self.client.force_authenticate(user=self.user)

        self.assessment = Assessment.objects.create(
            course_id="1",
            title="Test Quiz",
            description="Test Description",
            questions=[
                {
                    "question": "What is 2+2?",
                    "options": ["3", "4", "5"],
                    "answer": 1
                },
                {
                    "question": "Capital of France?",
                    "options": ["Paris", "London"],
                    "answer": 0
                }
            ]
        )

    def test_get_assessment(self):
        response = self.client.get(f'/api/assessments/{self.assessment.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['questions']), 2)

    def test_submit_assessment(self):
        url = f'/api/assessments/{self.assessment.id}/submit/'
        # User answers: Q1 -> 1 (Correct), Q2 -> 1 (Wrong, correct is 0)
        data = {
            "answers": {
                "0": 1,
                "1": 1
            }
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['score'], 1)
        self.assertEqual(response.data['total'], 2)
        self.assertEqual(response.data['percentage'], 50.0)

        results = response.data['results']
        self.assertTrue(results[0]['correct'])
        self.assertFalse(results[1]['correct'])
