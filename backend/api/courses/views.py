from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import action
from .models import Course, CodingExercise
from .serializers import CourseSerializer, CodingExerciseSerializer
from api.permissions import IsInstructorOrReadOnly
from api.progress.models import CodingExerciseSubmission, Progress
import subprocess
import tempfile
from pathlib import Path

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

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit coding exercise solution and validate against test cases"""
        exercise = self.get_object()
        user = request.user
        code = request.data.get('code', '')
        
        if not code:
            return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Execute code and validate against test cases
        test_results = []
        passed_tests = 0
        total_tests = len(exercise.test_cases) if exercise.test_cases else 0
        
        # Run code execution for each test case
        for idx, test_case in enumerate(exercise.test_cases):
            test_input = test_case.get('input', '')
            expected_output = test_case.get('output', '').strip()
            
            # Prepare code with test input
            test_code = code
            if test_input:
                # Try to inject input - simple approach: assume input() calls
                # For more complex cases, we'd need to handle stdin
                test_code = code.replace('input()', f'"{test_input}"')
            
            # Execute code
            execution_result = self._execute_code_safely(test_code, exercise.language)
            
            if execution_result.get('error'):
                test_results.append({
                    'test_case': idx + 1,
                    'input': test_input,
                    'expected_output': expected_output,
                    'actual_output': None,
                    'passed': False,
                    'error': execution_result['error']
                })
            else:
                actual_output = execution_result.get('output', '').strip()
                passed = actual_output == expected_output
                if passed:
                    passed_tests += 1
                
                test_results.append({
                    'test_case': idx + 1,
                    'input': test_input,
                    'expected_output': expected_output,
                    'actual_output': actual_output,
                    'passed': passed,
                    'error': None
                })
        
        # Save submission
        submission = CodingExerciseSubmission.objects.create(
            user=user,
            exercise=exercise,
            code=code,
            test_results=test_results,
            passed_tests=passed_tests,
            total_tests=total_tests
        )
        
        # Update progress
        if exercise.course:
            progress, _ = Progress.objects.get_or_create(
                user=user,
                course=exercise.course
            )
            progress.save()
        
        return Response({
            'submission_id': submission.id,
            'passed_tests': passed_tests,
            'total_tests': total_tests,
            'all_passed': passed_tests == total_tests,
            'test_results': test_results
        })
    
    def _execute_code_safely(self, code, language):
        """Safely execute code with security checks"""
        if language != 'python':
            return {"error": "Only Python is supported currently"}
        
        # SECURITY CHECK: Basic Blocklist
        forbidden_terms = ['import os', 'import subprocess', 'import sys', 'from os', 
                          'from subprocess', 'from sys', '__import__', 'open(']
        for term in forbidden_terms:
            if term in code:
                return {"error": f"Security violation: usage of '{term}' is not allowed."}
        
        temp_file_path = None
        try:
            # Create a temporary file to run the code
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
                temp_file.write(code)
                temp_file_path = temp_file.name

            # Run the code using subprocess with a timeout
            process = subprocess.run(
                ['python', temp_file_path],
                capture_output=True,
                text=True,
                timeout=5  # 5 seconds timeout
            )

            output = process.stdout
            error = None
            if process.stderr:
                error = process.stderr

            return {"output": output, "error": error}

        except subprocess.TimeoutExpired:
            return {"error": "Execution timed out (limit: 5s)."}
        except Exception as e:
            return {"error": str(e)}
        finally:
            # Clean up temp file
            if temp_file_path:
                try:
                    temp_path = Path(temp_file_path)
                    if temp_path.exists():
                        temp_path.unlink()
                except Exception:
                    pass  # Ignore cleanup errors

class ExecuteCodeView(APIView):
    """Execute code without test case validation (for testing/debugging)"""
    permission_classes = [permissions.IsAuthenticated]
    
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
        temp_file_path = None
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
            # Clean up temp file using pathlib instead of os
            if temp_file_path:
                try:
                    temp_path = Path(temp_file_path)
                    if temp_path.exists():
                        temp_path.unlink()
                except Exception:
                    pass  # Ignore cleanup errors

        return Response({"output": output})
