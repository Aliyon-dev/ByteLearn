from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class CodingExercise(models.Model):
    course = models.ForeignKey(Course, related_name='exercises', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    starter_code = models.TextField()
    solution = models.TextField(blank=True) # Hidden from student
    test_cases = models.JSONField(default=list) # [{'input': '...', 'output': '...'}]
    language = models.CharField(max_length=50, default='python')

    def __str__(self):
        return self.title
