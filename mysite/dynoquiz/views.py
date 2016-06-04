from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.utils import timezone
from django.contrib.auth import authenticate, login

from .models import Quiz, Question, Choice

#TODO: Lots of deletes need to happen here now that the API has replaced files
def signin(request):
    return render(request, 'dynoquiz/signin.html')

def loginuser(request):
    #test user login
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return HttpResponseRedirect(reverse('dynoquiz:index'))
        else:
            #TODO: handle inactive user accounts
            return render(request, 'dynoquiz/signin.html')
    else:
        return render(request, 'dynoquiz/signin.html')

def index(request):
    quiz_list = Quiz.objects.all()
    context = {'quiz_list': quiz_list}
    return render(request, 'dynoquiz/index.html', context)

def quizdetail(request, quiz_id):
    quiz = Quiz.objects.get(pk=quiz_id)
    context = {'quiz': quiz}
    return render(request, 'dynoquiz/quizdetail.html', context)

def vote(request, quiz_id):
    quiz = Quiz.objects.get(pk=quiz_id)

    #confirm that all questions have been answered
    try:
        for question in quiz.question_set.all():
            if question.choice_set.all():
                request.POST['question'+ str(question.id)]
    except(KeyError, Choice.DoesNotExist):
        #redisplay the quiz if a question hasn't been answered
        return render(request, 'dynoquiz/quizdetail.html', {
            'quiz': quiz,
            'error_message': "You didn't answer all questions."
        })
    else:
        #add responses to database
        for question in quiz.question_set.all():
            if question.choice_set.all():
                selected_choice = question.choice_set.get(pk=request.POST['question'+ str(question.id)] )
                selected_choice.votes += 1
                selected_choice.save()

        return HttpResponseRedirect(reverse('dynoquiz:results', args=(quiz.id,)))

def results(request, quiz_id):
    quiz = Quiz.objects.get(pk=quiz_id)
    context = {'quiz': quiz}
    return render(request, 'dynoquiz/results.html', context)

def newquiz(request):
    return render(request, 'dynoquiz/newquiz.html', context=None)

def createquiz(request):
    name = request.POST['quiz-name']
    details = request.POST['quiz-details']
    today = timezone.now()
    quiz = Quiz(quiz_name=name, quiz_details=details, date_created=today)
    quiz.save()

    return HttpResponseRedirect(reverse('dynoquiz:index'))

def newquestion(request, quiz_id):
    quiz = Quiz.objects.get(pk=quiz_id)
    context = {'quiz': quiz}
    return render(request, 'dynoquiz/newquestion.html', context)

def addquestion(request, quiz_id):
    quiz = Quiz.objects.get(pk=quiz_id)
    questionText = request.POST['question-text']
    today = timezone.now()
    quiz.question_set.create(question_text=questionText, date_created=today)
    quiz.save()

    return HttpResponseRedirect(reverse('dynoquiz:quiz_detail', args=(quiz.id,)))

def angular(request):
        return render(request, 'dynoquiz/angular.html')

        