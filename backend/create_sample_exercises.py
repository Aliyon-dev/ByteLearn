#!/usr/bin/env python
"""Create a sample coding exercise for testing the code interpreter."""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'base.settings')
django.setup()

from api.courses.models import Course, CodingExercise
from django.contrib.auth.models import User

# Get or create a course
admin_user = User.objects.filter(is_superuser=True).first()
if not admin_user:
    print("No admin user found. Please create one first.")
    exit(1)

course, created = Course.objects.get_or_create(
    title="Python Basics",
    defaults={
        'description': "Learn the fundamentals of Python programming",
        'instructor': admin_user
    }
)

if created:
    print(f"Created course: {course.title}")
else:
    print(f"Using existing course: {course.title}")

# Create sample coding exercises
exercises = [
    {
        'title': 'Hello World',
        'description': 'Write a program that prints "Hello, World!" to the console.',
        'starter_code': '# Write your code here\n',
        'solution': 'print("Hello, World!")',
        'test_cases': [
            {'input': '', 'output': 'Hello, World!'}
        ],
        'language': 'python'
    },
    {
        'title': 'Simple Addition',
        'description': 'Write a program that adds two numbers (5 and 3) and prints the result.',
        'starter_code': '# Add 5 and 3, then print the result\n',
        'solution': 'result = 5 + 3\nprint(result)',
        'test_cases': [
            {'input': '', 'output': '8'}
        ],
        'language': 'python'
    },
    {
        'title': 'FizzBuzz (First 15)',
        'description': '''Write a program that prints numbers from 1 to 15.
For multiples of 3, print "Fizz" instead of the number.
For multiples of 5, print "Buzz" instead of the number.
For multiples of both 3 and 5, print "FizzBuzz".''',
        'starter_code': '''# Write your FizzBuzz solution here
for i in range(1, 16):
    # Your code here
    pass
''',
        'solution': '''for i in range(1, 16):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)''',
        'test_cases': [
            {'input': '', 'output': '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz'}
        ],
        'language': 'python'
    }
]

for ex_data in exercises:
    exercise, created = CodingExercise.objects.get_or_create(
        course=course,
        title=ex_data['title'],
        defaults={
            'description': ex_data['description'],
            'starter_code': ex_data['starter_code'],
            'solution': ex_data['solution'],
            'test_cases': ex_data['test_cases'],
            'language': ex_data['language']
        }
    )
    
    if created:
        print(f"✓ Created exercise: {exercise.title} (ID: {exercise.id})")
    else:
        print(f"○ Exercise already exists: {exercise.title} (ID: {exercise.id})")

print(f"\nCourse ID: {course.id}")
print(f"Total exercises: {CodingExercise.objects.filter(course=course).count()}")
print(f"\nTest URLs:")
for ex in CodingExercise.objects.filter(course=course):
    print(f"  http://localhost:3001/courses/{course.id}/coding/{ex.id}")
