from rest_framework import serializers
from .models import Progress, LessonCompletion, CodingExerciseSubmission
from api.courses.serializers import CourseSerializer

class ProgressSerializer(serializers.ModelSerializer):
    course_detail = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = Progress
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at', 'last_accessed')


class LessonCompletionSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    course_title = serializers.CharField(source='lesson.course.title', read_only=True)
    
    class Meta:
        model = LessonCompletion
        fields = '__all__'
        read_only_fields = ('user', 'completed_at')


class CodingExerciseSubmissionSerializer(serializers.ModelSerializer):
    exercise_title = serializers.CharField(source='exercise.title', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = CodingExerciseSubmission
        fields = '__all__'
        read_only_fields = ('user', 'submitted_at')
