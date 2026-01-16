from django.db import models
from django.contrib.auth.models import User
from api.courses.models import Course
import json

class Assessment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assessments', null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    time_limit = models.IntegerField(default=0) # in minutes
    attempts = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    # Store questions as JSON for simplicity given the frontend type structure
    # Alternatively could be a separate model
    questions = models.JSONField(default=list)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.title


class AssessmentSubmission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assessment_submissions')
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='submissions')
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    percentage = models.FloatField(default=0.0)
    answers = models.JSONField(default=dict)  # Store user's answers
    results = models.JSONField(default=list)  # Store detailed results per question
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']
        # No unique_together - allow multiple attempts per user/assessment

    def __str__(self):
        return f"{self.user.username} - {self.assessment.title} - {self.percentage}%"
