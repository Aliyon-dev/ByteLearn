from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Course, CodingExercise
from .serializers import CourseSerializer, CodingExerciseSerializer
from api.permissions import IsInstructorOrReadOnly
import subprocess
import tempfile
import os

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsInstructorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

class CodingExerciseViewSet(viewsets.ModelViewSet):
    queryset = CodingExercise.objects.all()
    serializer_class = CodingExerciseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsInstructorOrReadOnly]

class ExecuteCodeView(APIView):
    def post(self, request):
        code = request.data.get('code')
        language = request.data.get('language', 'python')

        if not code:
            return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)

        if language != 'python':
             return Response({"error": "Only Python is supported currently"}, status=status.HTTP_400_BAD_REQUEST)

        # SECURITY CHECK: Basic Blocklist
        # This is NOT a complete sandbox. It is a minimal deterrent.
        # Real sandboxing requires Docker/Containers which is out of scope for this environment.
        forbidden_terms = ['import os', 'import subprocess', 'import sys', 'from os', 'from subprocess', 'from sys', '__import__', 'open(']
        for term in forbidden_terms:
            if term in code:
                return Response({"error": f"Security violation: usage of '{term}' is not allowed."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a temporary file to run the code
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
                temp_file.write(code)
                temp_file_path = temp_file.name

            # Run the code using subprocess with a timeout
            process = subprocess.run(
                ['python', temp_file_path],
                capture_output=True,
                text=True,
                timeout=5 # 5 seconds timeout
            )

            output = process.stdout
            if process.stderr:
                output += "\nError:\n" + process.stderr

        except subprocess.TimeoutExpired:
            output = "Error: Execution timed out (limit: 5s)."
        except Exception as e:
            output = f"Error: {str(e)}"
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

        return Response({"output": output})
