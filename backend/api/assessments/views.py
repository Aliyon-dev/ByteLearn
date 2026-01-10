from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Assessment
from .serializers import AssessmentSerializer

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        assessment = self.get_object()
        user_answers = request.data.get('answers', {}) # {question_index: selected_option_index}

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

        # Here we should save the progress to Progress model, but for MVP we return the result
        return Response({
            "score": score,
            "total": total_questions,
            "percentage": percentage,
            "results": results
        })
