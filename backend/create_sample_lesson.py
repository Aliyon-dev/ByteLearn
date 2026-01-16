from api.courses.models import Course
from api.lessons.models import Lesson
from django.contrib.auth import get_user_model

User = get_user_model()
admin = User.objects.get(username='admin')

# Create or get a course
course, created = Course.objects.get_or_create(
    title='Introduction to Python Programming',
    defaults={
        'description': 'Learn Python programming from scratch with video tutorials',
        'instructor': admin
    }
)

# Create a lesson with video
lesson, created = Lesson.objects.get_or_create(
    title='Python Basics - Getting Started',
    course=course,
    defaults={
        'description': 'Introduction to Python programming basics',
        'content': '''# Welcome to Python Programming!

In this lesson, you'll learn the fundamentals of Python programming.

## Topics Covered:
- What is Python?
- Setting up your environment
- Your first Python program
- Variables and data types

## Getting Started

Python is a high-level, interpreted programming language known for its simplicity and readability.

### Hello World Example

```python
print("Hello, World!")
```

This simple program demonstrates the basic syntax of Python.
''',
        'video_path': 'http://localhost:8000/media/videos/sample-intro.mp4',
        'duration': 5,
        'order': 1
    }
)

print(f'Course: {course.title} (ID: {course.id})')
print(f'Lesson: {lesson.title} (ID: {lesson.id})')
print(f'Video Path: {lesson.video_path}')
