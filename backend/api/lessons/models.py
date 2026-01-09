from django.db import models

class Lesson(models.Model):
    course_id = models.CharField(max_length=255) # Assuming simplified linking for now, or could be FK to Course
    title = models.CharField(max_length=255)
    description = models.TextField()
    content = models.TextField() # Markdown content
    video_path = models.CharField(max_length=255, blank=True, null=True)
    duration = models.IntegerField(default=0) # in minutes
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.title
