from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Progress, LessonCompletion, CodingExerciseSubmission
from .serializers import ProgressSerializer, LessonCompletionSerializer, CodingExerciseSubmissionSerializer
from api.courses.models import Course

class ProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Add queryset just for metadata or override basename in router
    queryset = Progress.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['course']

    def get_queryset(self):
        if self.request.user.is_anonymous:
             return Progress.objects.none()
        return Progress.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def course_details(self, request):
        """Get detailed progress for a specific course"""
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response({"error": "course_id parameter required"}, status=400)
        
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)
        
        progress, _ = Progress.objects.get_or_create(
            user=request.user,
            course=course
        )
        
        # Get lesson completions
        lesson_completions = LessonCompletion.objects.filter(
            user=request.user,
            lesson__course=course
        )
        
        # Get coding exercise submissions
        coding_submissions = CodingExerciseSubmission.objects.filter(
            user=request.user,
            exercise__course=course
        )
        
        serializer = ProgressSerializer(progress)
        return Response({
            'progress': serializer.data,
            'lesson_completions': LessonCompletionSerializer(lesson_completions, many=True).data,
            'coding_submissions': CodingExerciseSubmissionSerializer(coding_submissions, many=True).data
        })
    
    @action(detail=True, methods=['post'])
    def mark_complete(self, request, pk=None):
        """Mark a course as complete"""
        progress = self.get_object()
        
        # Ensure the progress belongs to the requesting user
        if progress.user != request.user:
            return Response(
                {"error": "You don't have permission to modify this progress"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        progress.is_completed = True
        progress.completed_at = timezone.now()
        progress.save()
        
        serializer = self.get_serializer(progress)
        return Response({
            'message': 'Course marked as complete',
            'progress': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def mark_incomplete(self, request, pk=None):
        """Mark a course as incomplete"""
        progress = self.get_object()
        
        # Ensure the progress belongs to the requesting user
        if progress.user != request.user:
            return Response(
                {"error": "You don't have permission to modify this progress"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        progress.is_completed = False
        progress.completed_at = None
        progress.save()
        
        serializer = self.get_serializer(progress)
        return Response({
            'message': 'Course marked as incomplete',
            'progress': serializer.data
        })


class LessonCompletionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing lesson completions (read-only, created via lesson complete action)"""
    serializer_class = LessonCompletionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return LessonCompletion.objects.filter(user=self.request.user)


class CodingExerciseSubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing coding exercise submissions (read-only, created via exercise submit action)"""
    serializer_class = CodingExerciseSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['exercise']
    
    def get_queryset(self):
        return CodingExerciseSubmission.objects.filter(user=self.request.user)
