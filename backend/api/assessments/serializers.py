from rest_framework import serializers
from .models import Assessment, AssessmentSubmission
from api.courses.serializers import CourseSerializer

class AssessmentSerializer(serializers.ModelSerializer):
    course_detail = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = Assessment
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class AssessmentSubmissionSerializer(serializers.ModelSerializer):
    assessment_title = serializers.CharField(source='assessment.title', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = AssessmentSubmission
        fields = '__all__'
        read_only_fields = ('user', 'submitted_at')
