from django.db import models
import json

class Assessment(models.Model):
    course_id = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    description = models.TextField()
    time_limit = models.IntegerField(default=0) # in minutes
    attempts = models.IntegerField(default=1)

    # Store questions as JSON for simplicity given the frontend type structure
    # Alternatively could be a separate model
    questions = models.JSONField(default=list)

    def __str__(self):
        return self.title
