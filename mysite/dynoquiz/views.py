from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.utils import timezone
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User

from .models import Quiz, Question, Choice

#TODO: Lots of deletes need to happen here now that the API has replaced files

#Redirect logged in users from /siginin to their home
def userloggedin(user):
    return not user.is_authenticated()

#Decorator for confriming user owns the quiz in question
def user_owns_quiz(func):
    def check_ownership(request, *args, **kwargs):
        quizId = kwargs["quiz_id"]
        quiz = Quiz.objects.get(pk=quizId)
        if not (quiz.owner == request.user):
            #TODO: Make forbidden page
            return HttpResponseRedirect(reverse('dynoquiz:index'))
        return func(request, *args, **kwargs)
    return check_ownership


#Redirect to sign in page
@user_passes_test(userloggedin, login_url='quiz/')
def signin(request):
    return render(request, 'dynoquiz/signin.html')

#Login Action
def loginuser(request):
    username = request.POST['loginUsername']
    password = request.POST['loginPassword']
    return (authenticateUser(request, username, password))

def registeruser(request):
    username = request.POST['registerUsername']
    password = request.POST['registerPassword']
    email = request.POST['registerEmail']

    #TODO: do this client side
    #check if user exists
    if User.objects.filter(username=username).exists() is True:
        return HttpResponseRedirect(reverse('dynoquiz:signin'))

    newUser = User.objects.create_user(username, email, password)
    newUser.save()
    return(authenticateUser(request, username, password))

#authenticate users from login and register forms
def authenticateUser(request, username, password):
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

#authenticate user on login and register Redirect as needed
def authenticateUser(request, username, password):
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

@login_required
def index(request):
    quiz_list = Quiz.objects.all()
    context = {'quiz_list': quiz_list}
    return render(request, 'dynoquiz/index.html', context)

@login_required
def quizdetail(request, quiz_id):
    quiz = Quiz.objects.get(pk=quiz_id)
    context = {'quiz': quiz}
    return render(request, 'dynoquiz/takequiz.html', context)

@login_required
@user_owns_quiz
def quizedit(request, quiz_id):
    quiz = Quiz.objects.get(pk=quiz_id)
    context = {'quiz': quiz}
    return render(request, 'dynoquiz/editquiz.html', context)

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
        return render(request, 'dynoquiz/takequiz.html', {
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

        