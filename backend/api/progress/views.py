from rest_framework import viewsets, permissions
from .models import Progress
from .serializers import ProgressSerializer

class ProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Add queryset just for metadata or override basename in router
    queryset = Progress.objects.all()

    def get_queryset(self):
        if self.request.user.is_anonymous:
             return Progress.objects.none()
        return Progress.objects.filter(user=self.request.user)
