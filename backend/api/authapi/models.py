from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    USER_ROLES = (
        ('student', 'Student'),
        ('instructor', 'Instructor'),
        ('admin', 'Admin'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=USER_ROLES, default='student')
    student_id = models.CharField(max_length=50, blank=True, null=True)
    mfa_enabled = models.BooleanField(default=False)
    mfa_secret = models.CharField(max_length=32, blank=True, null=True)

    def __str__(self):
        return self.user.username
