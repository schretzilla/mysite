from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.utils import timezone
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .models import Quiz, Question, Choice

#TODO: Lots of deletes need to happen here now that the API has replaced files
#Redirect to sign in page
def signin(request):
    return render(request, 'dynoquiz/signin.html')

#Login Action
def loginuser(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return HttpResponseRedirect(reverse('dynoquiz:index'))
        else:
            #TODO: handle inactive user accounts
            return HttpResponseRedirect(reverse('dynoquiz:signin'))
    else:
        return HttpResponseRedirect(reverse('dynoquiz:signin'))

def logoutuser(request):
    logout(request)
    return HttpResponseRedirect(reverse('dynoquiz:signin'))

@login_required
def index(request):
    quiz_list = Quiz.objects.all()
    context = {'quiz_list': quiz_list}
    return render(request, 'dynoquiz/index.html', context)

@login_required
def quizdetail(request, quiz_id):
    quiz = Quiz.objects.get(pk=quiz_id)
    context = {'quiz': quiz}
    return render(request, 'dynoquiz/quizdetail.html', context)

#This should probably be depreciated
@login_required
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

#Deperciated
@login_required
def results(request, quiz_id):
    quiz = Quiz.objects.get(pk=quiz_id)
    context = {'quiz': quiz}
    return render(request, 'dynoquiz/results.html', context)

#Depreciated
@login_required
def newquiz(request):
    return render(request, 'dynoquiz/newquiz.html', context=None)

#Depreciated
@login_required
def createquiz(request):
    name = request.POST['quiz-name']
    details = request.POST['quiz-details']
    today = timezone.now()
    quiz = Quiz(quiz_name=name, quiz_details=details, date_created=today)
    quiz.save()

    return HttpResponseRedirect(reverse('dynoquiz:index'))

#Deperciated
@login_required
def newquestion(request, quiz_id):
    quiz = Quiz.objects.get(pk=quiz_id)
    context = {'quiz': quiz}
    return render(request, 'dynoquiz/newquestion.html', context)

#Depreciated
@login_required
def addquestion(request, quiz_id):
    quiz = Quiz.objects.get(pk=quiz_id)
    questionText = request.POST['question-text']
    today = timezone.now()
    quiz.question_set.create(question_text=questionText, date_created=today)
    quiz.save()

    return HttpResponseRedirect(reverse('dynoquiz:quiz_detail', args=(quiz.id,)))

#Delete
def angular(request):
        return render(request, 'dynoquiz/angular.html')

        