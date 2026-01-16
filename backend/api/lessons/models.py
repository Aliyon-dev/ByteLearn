from django.db import models
from api.courses.models import Course

class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons', null=True)
    # course_id removed to avoid clash with ForeignKey field name (which creates course_id column)
    title = models.CharField(max_length=255)
    description = models.TextField()
    content = models.TextField() # Markdown content
    video_path = models.CharField(max_length=255, blank=True, null=True) # Deprecated or used for external links
    video_file = models.FileField(upload_to='videos/', blank=True, null=True)
    duration = models.IntegerField(default=0) # in minutes
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.title
