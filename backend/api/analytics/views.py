from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from api.courses.models import Course
from .utils import (
    calculate_student_analytics,
    calculate_course_analytics,
    calculate_instructor_analytics,
    calculate_system_analytics,
    get_progress_over_time,
    get_assessment_scores_over_time,
)
from .serializers import (
    StudentAnalyticsSerializer,
    CourseAnalyticsSerializer,
    InstructorAnalyticsSerializer,
    SystemAnalyticsSerializer,
    ProgressOverTimeSerializer,
    AssessmentScoreSerializer,
)


class AnalyticsViewSet(viewsets.ViewSet):
    """ViewSet for analytics endpoints."""
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def student(self, request):
        """
        Get analytics for the current student.
        GET /api/analytics/student/
        """
        analytics_data = calculate_student_analytics(request.user)
        serializer = StudentAnalyticsSerializer(analytics_data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def course(self, request):
        """
        Get analytics for a specific course (instructor only).
        GET /api/analytics/course/?course_id=<id>
        """
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response(
                {'error': 'course_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(
                {'error': 'Course not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if user is instructor of this course or admin
        if course.instructor != request.user and not request.user.profile.role == 'admin':
            return Response(
                {'error': 'You do not have permission to view this course analytics'},
                status=status.HTTP_403_FORBIDDEN
            )

        analytics_data = calculate_course_analytics(course)
        serializer = CourseAnalyticsSerializer(analytics_data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def instructor(self, request):
        """
        Get analytics for all courses taught by the current instructor.
        GET /api/analytics/instructor/
        """
        # Check if user is instructor or admin
        if request.user.profile.role not in ['instructor', 'admin']:
            return Response(
                {'error': 'Only instructors and admins can access this endpoint'},
                status=status.HTTP_403_FORBIDDEN
            )

        analytics_data = calculate_instructor_analytics(request.user)
        serializer = InstructorAnalyticsSerializer(analytics_data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def system(self, request):
        """
        Get system-wide analytics (admin only).
        GET /api/analytics/system/
        """
        # Check if user is admin
        if request.user.profile.role != 'admin':
            return Response(
                {'error': 'Only admins can access system analytics'},
                status=status.HTTP_403_FORBIDDEN
            )

        analytics_data = calculate_system_analytics()
        serializer = SystemAnalyticsSerializer(analytics_data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def progress_over_time(self, request):
        """
        Get progress over time for the current user.
        GET /api/analytics/progress_over_time/?days=30
        """
        days = int(request.query_params.get('days', 30))
        progress_data = get_progress_over_time(request.user, days)
        serializer = ProgressOverTimeSerializer(progress_data, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def assessment_scores(self, request):
        """
        Get assessment scores over time for the current user.
        GET /api/analytics/assessment_scores/
        """
        scores_data = get_assessment_scores_over_time(request.user)
        serializer = AssessmentScoreSerializer(scores_data, many=True)
        return Response(serializer.data)
