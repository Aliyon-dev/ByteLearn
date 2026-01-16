from django.contrib import admin
from .models import Lesson

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'duration', 'created_at']
    list_filter = ['course', 'created_at']
    search_fields = ['title', 'description']
    ordering = ['course', 'order']
    readonly_fields = ['created_at', 'updated_at']
