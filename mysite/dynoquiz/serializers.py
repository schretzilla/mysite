from .models import Quiz, Question, Choice, QuizUser, QuizScore, QuestionAttempt
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'quizzes'
        )

#TODO: Fix Ordering issues
class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = (
            'id',
            'quiz_name',
            'quiz_details',
            'date_created',
            'owner',
            'users'
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
class QuestionAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAttempt
        fields = (
            'id',
            'quiz_score',
            'question',
            'choice'
        )

class QuizScoreSerializer(serializers.ModelSerializer):
    question_attempts = QuestionAttemptSerializer(many=True, read_only=True)
    class Meta:
        model = QuizScore
        fields = (
            'id',
            'question_attempts',
            'correct',
            'incorrect'
        )

class QuizUserSerializer(serializers.ModelSerializer):
    #quiz_score = QuizScoreSerializer(many=True, read_only=True)
    class Meta:
        model = QuizUser
        fields = (
            'id',
            'quiz',
            'user'
        )