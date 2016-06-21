from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

#A quiz contains many questions
class Quiz(models.Model):
    #TODO: Rename these columns, name detials. remove quiz
    owner = models.ForeignKey(User, related_name='owned_quizzes', null=True)
    quiz_name = models.CharField(max_length=100)
    quiz_details = models.CharField(max_length=200, null=True)
    users = models.ManyToManyField(User,  related_name='quizzes', help_text="Users the quiz is shared with.")
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
