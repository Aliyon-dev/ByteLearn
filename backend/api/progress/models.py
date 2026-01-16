from django.db import models
from django.contrib.auth.models import User
from api.courses.models import Course
from api.lessons.models import Lesson

class Progress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='progress', null=True, blank=True)
    lessons_completed = models.IntegerField(default=0)
    total_lessons = models.IntegerField(default=0)
    assessments_completed = models.IntegerField(default=0)
    total_assessments = models.IntegerField(default=0)
    time_spent = models.IntegerField(default=0) # in minutes
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    last_accessed = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        unique_together = ['user', 'course']
        ordering = ['-last_accessed']

    def __str__(self):
        return f"{self.user.username} - {self.course.title}"


class LessonCompletion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_completions')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='completions')
    completed_at = models.DateTimeField(auto_now_add=True)
    time_spent = models.IntegerField(default=0) # in minutes

    class Meta:
        unique_together = ['user', 'lesson']
        ordering = ['-completed_at']

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"


class CodingExerciseSubmission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='coding_submissions')
    exercise = models.ForeignKey('courses.CodingExercise', on_delete=models.CASCADE, related_name='submissions')
    code = models.TextField()
    test_results = models.JSONField(default=list)  # Store test case results
    passed_tests = models.IntegerField(default=0)
    total_tests = models.IntegerField(default=0)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.user.username} - {self.exercise.title} - {self.passed_tests}/{self.total_tests}"
