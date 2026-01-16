from rest_framework import serializers


class StudentAnalyticsSerializer(serializers.Serializer):
    """Serializer for student analytics data."""
    total_time_spent = serializers.IntegerField()
    total_courses = serializers.IntegerField()
    completed_courses = serializers.IntegerField()
    avg_assessment_score = serializers.FloatField()
    total_assessments = serializers.IntegerField()
    total_coding_exercises = serializers.IntegerField()
    coding_success_rate = serializers.FloatField()
    learning_streak = serializers.IntegerField()
    recent_activity = serializers.DictField()


class CourseAnalyticsSerializer(serializers.Serializer):
    """Serializer for course analytics data."""
    total_students = serializers.IntegerField()
    completed_students = serializers.IntegerField()
    completion_rate = serializers.FloatField()
    avg_lessons_completed = serializers.FloatField()
    avg_assessments_completed = serializers.FloatField()
    avg_assessment_score = serializers.FloatField()
    total_assessments = serializers.IntegerField()
    total_coding_exercises = serializers.IntegerField()
    total_coding_submissions = serializers.IntegerField()
    avg_time_spent = serializers.FloatField()
    total_time_spent = serializers.IntegerField()
    most_engaged_students = serializers.ListField()


class InstructorAnalyticsSerializer(serializers.Serializer):
    """Serializer for instructor analytics data."""
    total_courses = serializers.IntegerField()
    total_students = serializers.IntegerField()
    courses = serializers.ListField()


class SystemAnalyticsSerializer(serializers.Serializer):
    """Serializer for system-wide analytics data."""
    total_users = serializers.IntegerField()
    total_students = serializers.IntegerField()
    total_instructors = serializers.IntegerField()
    total_admins = serializers.IntegerField()
    total_courses = serializers.IntegerField()
    total_lessons = serializers.IntegerField()
    total_lesson_completions = serializers.IntegerField()
    total_assessment_submissions = serializers.IntegerField()
    total_coding_submissions = serializers.IntegerField()
    avg_assessment_score = serializers.FloatField()
    recent_active_users = serializers.IntegerField()
    recent_lesson_completions = serializers.IntegerField()
    recent_assessments = serializers.IntegerField()
    popular_courses = serializers.ListField()


class ProgressOverTimeSerializer(serializers.Serializer):
    """Serializer for progress over time data."""
    date = serializers.CharField()
    count = serializers.IntegerField()


class AssessmentScoreSerializer(serializers.Serializer):
    """Serializer for assessment scores over time."""
    date = serializers.CharField()
    score = serializers.FloatField()
    assessment = serializers.CharField()
