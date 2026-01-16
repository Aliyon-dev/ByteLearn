from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Lesson
from .serializers import LessonSerializer
from api.permissions import IsInstructorOrReadOnly
from api.progress.models import LessonCompletion, Progress

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsInstructorOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['course']
    ordering_fields = ['order', 'created_at']
    ordering = ['order', 'created_at']
    search_fields = ['title', 'description']

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark a lesson as completed for the current user"""
        lesson = self.get_object()
        user = request.user
        
        # Create or get lesson completion
        completion, created = LessonCompletion.objects.get_or_create(
            user=user,
            lesson=lesson
        )
        
        # Update or create progress for the course
        if lesson.course:
            progress, _ = Progress.objects.get_or_create(
                user=user,
                course=lesson.course
            )
            
            # Update lesson counts
            total_lessons = lesson.course.lessons.count()
            completed_lessons = LessonCompletion.objects.filter(
                user=user,
                lesson__course=lesson.course
            ).count()
            
            progress.total_lessons = total_lessons
            progress.lessons_completed = completed_lessons
            progress.save()
        
        return Response({
            'status': 'completed',
            'message': f'Lesson "{lesson.title}" marked as completed',
            'created': created
        })
