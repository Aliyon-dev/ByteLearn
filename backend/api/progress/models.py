from django.db import models
from django.contrib.auth.models import User

class Progress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course_id = models.CharField(max_length=255)
    lessons_completed = models.IntegerField(default=0)
    total_lessons = models.IntegerField(default=0)
    assessments_completed = models.IntegerField(default=0)
    total_assessments = models.IntegerField(default=0)
    time_spent = models.IntegerField(default=0) # in minutes
    last_accessed = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.course_id}"
