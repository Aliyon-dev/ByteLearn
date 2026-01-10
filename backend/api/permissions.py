from rest_framework import permissions

class IsInstructorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow instructors to edit objects.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to authenticated users
        if not request.user.is_authenticated:
            return False

        # Check if user has a profile and is an instructor
        # Handle case where user might not have a profile (though they should)
        try:
            return request.user.profile.role in ['instructor', 'admin']
        except AttributeError:
            return False
