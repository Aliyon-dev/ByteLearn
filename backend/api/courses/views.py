from rest_framework import viewsets, permissions, filters
from .models import Course
from .serializers import CourseSerializer
from api.authapi.models import Profile

class IsInstructor(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user.is_authenticated:
            return hasattr(request.user, 'profile') and request.user.profile.role == 'instructor'
        return False

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsInstructor]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)