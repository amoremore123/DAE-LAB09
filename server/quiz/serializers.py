from django.db import transaction
from rest_framework import serializers
from .models import Exam, Question, Option


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'title', 'created_at']
        read_only_fields = ['id', 'created_at']


class NestedOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']
        read_only_fields = ['id']


class QuestionSerializer(serializers.ModelSerializer):
    options = NestedOptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'exam', 'text', 'options']
        read_only_fields = ['id']

    def validate(self, attrs):
        options = attrs.get('options')
        if options is None and self.instance:
            options = list(self.instance.options.values('is_correct'))
        if sum(o.get('is_correct', False) for o in options or []) != 1:
            raise serializers.ValidationError({'options': 'Exactly one correct option is required.'})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        options = validated_data.pop('options')
        question = Question.objects.create(**validated_data)
        Option.objects.bulk_create([Option(question=question, **o) for o in options])
        return question

    @transaction.atomic
    def update(self, instance, validated_data):
        options = validated_data.pop('options', None)
        instance = super().update(instance, validated_data)
        if options is not None:
            instance.options.all().delete()
            Option.objects.bulk_create([Option(question=instance, **o) for o in options])
        return instance


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'question', 'text', 'is_correct']
        read_only_fields = ['id']

    def validate(self, attrs):
        question = attrs.get('question', getattr(self.instance, 'question', None))
        if self.instance and question.pk != self.instance.question_id:
            raise serializers.ValidationError('Change option membership through the question resource.')
        correct = attrs.get('is_correct', getattr(self.instance, 'is_correct', False))
        others = question.options.exclude(pk=getattr(self.instance, 'pk', None))
        if others.filter(is_correct=True).count() + int(correct) != 1:
            raise serializers.ValidationError('Exactly one correct option is required.')
        return attrs
