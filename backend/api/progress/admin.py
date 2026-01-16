from django.contrib import admin
from .models import Progress, LessonCompletion, CodingExerciseSubmission

@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'lessons_completed', 'total_lessons', 
                    'assessments_completed', 'total_assessments', 'last_accessed']
    list_filter = ['course', 'last_accessed']
    search_fields = ['user__username', 'course__title']
    readonly_fields = ['created_at', 'updated_at', 'last_accessed']

@admin.register(LessonCompletion)
class LessonCompletionAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'completed_at', 'time_spent']
    list_filter = ['lesson__course', 'completed_at']
    search_fields = ['user__username', 'lesson__title']
    readonly_fields = ['completed_at']

@admin.register(CodingExerciseSubmission)
class CodingExerciseSubmissionAdmin(admin.ModelAdmin):
    list_display = ['user', 'exercise', 'passed_tests', 'total_tests', 'submitted_at']
    list_filter = ['exercise__course', 'submitted_at']
    search_fields = ['user__username', 'exercise__title']
    readonly_fields = ['submitted_at']
