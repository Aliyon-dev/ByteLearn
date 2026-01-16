from rest_framework import serializers
from .models import Lesson
from api.courses.serializers import CourseSerializer

class LessonSerializer(serializers.ModelSerializer):
    course_detail = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = Lesson
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
