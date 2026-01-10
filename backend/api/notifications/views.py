from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Add queryset for metadata or override basename
    queryset = Notification.objects.all()

    def get_queryset(self):
        if self.request.user.is_anonymous:
             return Notification.objects.none()
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        self.get_queryset().update(read=True)
        return Response({'status': 'marked all as read'})

    # Mock Email/SMS Send
    @action(detail=False, methods=['post'])
    def send_external(self, request):
        """
        Simulates sending an external email or SMS.
        """
        message_type = request.data.get('type', 'email')
        recipient = request.data.get('recipient')
        content = request.data.get('content')

        # Log to console/stdout to simulate "sending"
        print(f"[{message_type.upper()}] Sent to {recipient}: {content}")

        return Response({'status': 'sent', 'detail': f'Mock {message_type} sent successfully'}, status=status.HTTP_200_OK)
