from .models import Quiz, Question, Choice
from .serializers import QuizSerializer, QuestionSerializer, ChoiceSerializer
from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics
#import pdb; pdb.set_trace()             #FOR TESTING



class QuizList(APIView):
    #return loggedin user's list of quizses
    def get(self, request, fromat=None):
        quizzes = Quiz.objects.filter(owner=request.user)
        serialized_quiz = QuizSerializer(quizzes, many=True)
        return Response(serialized_quiz.data)

    #create new quiz for logged in user
    def post(self, request, format=None):
        serializer = QuizSerializer(data=request.data)
        if serializer.is_valid():
            newQuiz = serializer.save()
            #TODO: There's probably a better way to do this w/o two saves
            #add user to quiz
            newQuiz.owner = request.user
            newQuiz.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QuizDetail(APIView):
    def get_quiz(self, pk):
        try:
            return Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        quiz = self.get_quiz(pk)
        serialized_quiz = QuizSerializer(quiz)
        return Response(serialized_quiz.data)

    def delete(self, request, pk, format=None):
        quiz = self.get_quiz(pk)
        quiz.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk, format=None):
        quiz = self.get_quiz(pk)
        serializer = QuizSerializer(quiz, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QuestionList(APIView):
    def get(self, request, pk, format=None):
        questions = Quiz.objects.get(pk=pk).question_set.all()
        serialized_questions = QuestionSerializer(questions, many=True)
        return Response(serialized_questions.data)

    def post(self, request, pk, format=None):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QuestionDetail(APIView):
    def get_question(self, question_id):
        try:
            return Question.objects.get(pk=question_id)
        except Question.DoesNotExist:
            raise Http404

    def get(self, request, pk, question_id, format=None):
        question = self.get_question(question_id)
        serialized_question = QuestionSerializer(question)
        return Response(serialized_question.data)

    def delete(self, request, pk, question_id, format=None):
        question = self.get_question(question_id)
        question.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk, question_id, format=None):
        question = self.get_question(question_id)
        serializer = QuestionSerializer(question, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ChoiceList(APIView):
    def get(self, request, question_id, format=None):
        choices = Question.objects.get(pk=question_id).choices
        serialized_choices = ChoiceSerializer(choices, many=True)
        return Response(serialized_choices.data)

    def post(self, request, question_id, format=None):
        serializer = ChoiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChoiceDetail(APIView):
    def get_choice(self, choice_id):
        try:
            return Choice.objects.get(pk=choice_id)
        except Choice.DoesNotExist:
            raise Http404

    def get(self, request, question_id, choice_id, format=None):
        choice = self.get_choice(choice_id)
        serialized_choice = ChoiceSerializer(choice)
        return Response(serialized_choice)

    def delete(self, request, question_id, choice_id, format=None):
        choice = self.get_choice(choice_id)
        choice.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, choice_id, format=None):
        choice = self.get_choice(choice_id)
        serializer = ChoiceSerializer(choice, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)











