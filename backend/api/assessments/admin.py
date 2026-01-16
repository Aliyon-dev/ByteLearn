from django.contrib import admin
from .models import Assessment, AssessmentSubmission

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'time_limit', 'attempts', 'created_at']
    list_filter = ['course', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(AssessmentSubmission)
class AssessmentSubmissionAdmin(admin.ModelAdmin):
    list_display = ['user', 'assessment', 'score', 'total_questions', 'percentage', 'submitted_at']
    list_filter = ['assessment', 'submitted_at']
    search_fields = ['user__username', 'assessment__title']
    readonly_fields = ['submitted_at']
