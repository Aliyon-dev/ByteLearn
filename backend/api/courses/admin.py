from django.contrib import admin
from .models import Course, CodingExercise

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'instructor', 'created_at']
    list_filter = ['created_at', 'instructor']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at']

@admin.register(CodingExercise)
class CodingExerciseAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'language']
    list_filter = ['course', 'language']
    search_fields = ['title', 'description']
