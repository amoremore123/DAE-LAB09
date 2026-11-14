from rest_framework import filters, viewsets
from rest_framework.exceptions import ValidationError
from .models import Exam, Question, Option
from .serializers import ExamSerializer, QuestionSerializer, OptionSerializer


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.order_by('id')
    serializer_class = ExamSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.prefetch_related('options').order_by('id')
    serializer_class = QuestionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['text']

    def get_queryset(self):
        queryset = super().get_queryset()
        exam = self.request.query_params.get('exam')
        if exam is not None:
            if not exam.isdigit():
                raise ValidationError({'exam': 'An integer is required.'})
            queryset = queryset.filter(exam_id=exam)
        return queryset


class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.select_related('question').order_by('id')
    serializer_class = OptionSerializer

    def perform_destroy(self, instance):
        if instance.is_correct:
            raise ValidationError('Replace options through the question before deleting the correct option.')
        instance.delete()
