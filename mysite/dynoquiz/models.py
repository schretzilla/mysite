from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

#A quiz contains many questions
class Quiz(models.Model):
    #TODO: Rename these columns, name detials. remove quiz
    owner = models.ForeignKey(User, related_name='owned_quizzes', null=True)
    quiz_name = models.CharField(max_length=100)
    quiz_details = models.CharField(max_length=200, null=True)
    users = models.ManyToManyField(User, through='QuizUser',  related_name='quizzes', blank=True, help_text="Users the quiz is shared with.")
    date_created = models.DateTimeField('date created')
    def __str__(self):
        return self.quiz_name

class Question(models.Model):
    quiz = models.ForeignKey(Quiz)
    answer = models.OneToOneField('Choice', related_name='answer', null=True)
    question_text = models.CharField(max_length=200)
    date_created = models.DateTimeField('date created')
    def __str__(self):
        return self.question_text

    @property
    def get_choices(self):
        return self.choice_set.all()


class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices')
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
    date_created = models.DateTimeField('date created', default=datetime.now)
    def __str__(self):
        return self.choice_text

#through model to store quiz, user relation
class QuizUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    available = models.BooleanField(default=True)

class QuizScore(models.Model):
    quiz_user = models.ForeignKey(QuizUser, related_name='scores', null=True)
    correct = models.IntegerField(default=0)
    incorrect = models.IntegerField(default=0)

class QuestionAttempt(models.Model):
    quiz_score = models.ForeignKey(QuizScore, related_name='question_attempts')
    question = models.ForeignKey(Question, related_name='attempts')
    choice = models.ForeignKey(Choice, related_name='guessed')