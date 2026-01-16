from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Assessment, AssessmentSubmission
from .serializers import AssessmentSerializer, AssessmentSubmissionSerializer
from api.permissions import IsInstructorOrReadOnly
from api.progress.models import Progress

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsInstructorOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['course']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']
    search_fields = ['title', 'description']

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit assessment answers and save submission"""
        assessment = self.get_object()
        user = request.user
        user_answers = request.data.get('answers', {}) # {question_index: selected_option_index}

        # Check attempt limits
        existing_submissions = AssessmentSubmission.objects.filter(
            user=user,
            assessment=assessment
        ).count()
        
        if existing_submissions >= assessment.attempts:
            return Response({
                "error": f"Maximum attempts ({assessment.attempts}) reached for this assessment"
            }, status=status.HTTP_400_BAD_REQUEST)

        score = 0
        total_questions = len(assessment.questions)

        results = []

        for idx, question in enumerate(assessment.questions):
            correct_answer = question.get('answer') # Assuming 0-indexed integer of correct option
            user_answer = user_answers.get(str(idx))

            is_correct = False
            if user_answer is not None and int(user_answer) == int(correct_answer):
                score += 1
                is_correct = True

            results.append({
                "question": question.get('question'),
                "correct": is_correct,
                "user_answer": user_answer,
                "correct_answer": correct_answer
            })

        percentage = (score / total_questions) * 100 if total_questions > 0 else 0

        # Save submission
        submission = AssessmentSubmission.objects.create(
            user=user,
            assessment=assessment,
            score=score,
            total_questions=total_questions,
            percentage=percentage,
            answers=user_answers,
            results=results
        )

        # Update progress
        if assessment.course:
            progress, _ = Progress.objects.get_or_create(
                user=user,
                course=assessment.course
            )
            
            # Update assessment counts
            total_assessments = assessment.course.assessments.count()
            completed_assessments = AssessmentSubmission.objects.filter(
                user=user,
                assessment__course=assessment.course
            ).values('assessment').distinct().count()
            
            progress.total_assessments = total_assessments
            progress.assessments_completed = completed_assessments
            progress.save()

        return Response({
            "score": score,
            "total": total_questions,
            "percentage": percentage,
            "results": results,
            "submission_id": submission.id,
            "attempts_remaining": assessment.attempts - existing_submissions - 1
        })

    @action(detail=True, methods=['get'])
    def submissions(self, request, pk=None):
        """Get all submissions for this assessment by the current user"""
        assessment = self.get_object()
        submissions = AssessmentSubmission.objects.filter(
            user=request.user,
            assessment=assessment
        ).order_by('-submitted_at')
        
        serializer = AssessmentSubmissionSerializer(submissions, many=True)
        return Response(serializer.data)
