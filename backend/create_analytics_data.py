import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'base.settings')
django.setup()

from django.contrib.auth.models import User
from api.progress.models import Progress, LessonCompletion
from api.assessments.models import AssessmentSubmission, Assessment
from api.courses.models import Course
from api.lessons.models import Lesson
from datetime import datetime, timedelta
from django.utils import timezone

# Get or create admin user
admin_user, _ = User.objects.get_or_create(
    username='admin',
    defaults={'email': 'admin@bytelearn.com', 'is_staff': True, 'is_superuser': True}
)
admin_user.set_password('admin123')
admin_user.save()

# Create admin profile if it doesn't exist
from api.authapi.models import Profile
admin_profile, _ = Profile.objects.get_or_create(
    user=admin_user,
    defaults={'role': 'admin'}
)

# Get or create a course
course, _ = Course.objects.get_or_create(
    title='Python Programming Basics',
    defaults={
        'description': 'Learn Python from scratch',
        'instructor': admin_user
    }
)

# Create some lessons
lesson1, _ = Lesson.objects.get_or_create(
    course=course,
    title='Introduction to Python',
    defaults={
        'description': 'Getting started with Python',
        'content': '# Introduction\n\nWelcome to Python!',
        'duration': 30,
        'order': 1
    }
)

lesson2, _ = Lesson.objects.get_or_create(
    course=course,
    title='Variables and Data Types',
    defaults={
        'description': 'Learn about variables',
        'content': '# Variables\n\nPython variables are containers.',
        'duration': 45,
        'order': 2
    }
)

# Create progress for admin user
progress, _ = Progress.objects.get_or_create(
    user=admin_user,
    course=course,
    defaults={
        'lessons_completed': 2,
        'total_lessons': 2,
        'assessments_completed': 1,
        'total_assessments': 1,
        'time_spent': 120  # 120 minutes
    }
)

# Create lesson completions
for i, lesson in enumerate([lesson1, lesson2], 1):
    LessonCompletion.objects.get_or_create(
        user=admin_user,
        lesson=lesson,
        defaults={
            'time_spent': 30 + (i * 10),
            'completed_at': timezone.now() - timedelta(days=i)
        }
    )

# Create an assessment
assessment, _ = Assessment.objects.get_or_create(
    course=course,
    title='Python Basics Quiz',
    defaults={
        'description': 'Test your Python knowledge',
        'time_limit': 30,
        'attempts': 3,
        'questions': [
            {
                'question': 'What is Python?',
                'options': ['A snake', 'A programming language', 'A game', 'A tool'],
                'correct': 1
            }
        ]
    }
)

# Create assessment submission
AssessmentSubmission.objects.get_or_create(
    user=admin_user,
    assessment=assessment,
    defaults={
        'score': 8,
        'total_questions': 10,
        'percentage': 80.0,
        'answers': {'1': 1},
        'results': [{'correct': True}]
    }
)

print("✅ Sample data created successfully!")
print(f"Course: {course.title}")
print(f"Lessons: {Lesson.objects.filter(course=course).count()}")
print(f"Progress: {progress.lessons_completed}/{progress.total_lessons} lessons")
print(f"Time spent: {progress.time_spent} minutes")
print(f"Assessments: {AssessmentSubmission.objects.filter(user=admin_user).count()}")
