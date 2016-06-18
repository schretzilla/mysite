from .models import Quiz, Question, Choice

from rest_framework import serializers

#TODO: Fix Ordering issues
class QuizSerializer(serializers.ModelSerializer):
	class Meta:
		model = Quiz
		fields = (
			'id',
			'quiz_name',
			'quiz_details',
			'date_created',
            'owner'
		)

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        ordering = ['-created',]
        model = Choice
        fields = (
            'id',
            'choice_text',
            'question',
            'votes'
        )

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    class Meta:
        ordering = ['-created',]
        model = Question
        fields = (
            'id',
            'question_text',
            'quiz',
            'date_created',
            'choices',
            'answer'
        )
