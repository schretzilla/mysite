from django.conf.urls import patterns, include, url

from . import views

#Rest API
from rest_framework.urlpatterns import format_suffix_patterns
from dynoquiz import api

#added patterns here for api json
urlpatterns = [
    #Login Page
    url(r'^signin/$', views.signin, name='signin'),
    url(r'^loginuser/$', views.loginuser, name='login_user'),
    url(r'^registeruser/$', views.registeruser, name='register_user'),
    url(r'^$', views.signin, name='signin'),


    url(r'^signout/$', views.logoutuser, name='logout_user'),

    #url(arg1 = just for visual url, ar2=method to use, arg3= alias to ref this )
    url(r'^quiz/$', views.index, name='index'),
    #Quiz Question Details
    url(r'^quiz/(?P<quiz_id>[0-9]+)/$', views.quizdetail, name='quiz_detail'),
    #Vote on Quiz
    url(r'^quiz/(?P<quiz_id>[0-9]+)/vote/$', views.vote, name ='vote'),
    #Results of Quiz
    url(r'^quiz/(?P<quiz_id>[0-9]+)/results/$', views.results, name='results'),
    #New Quiz Form
    url(r'^quiz/newquiz/$', views.newquiz, name='new_quiz'),
    #Create New Quiz
    url(r'^quiz/createquiz/$', views.createquiz, name='create_quiz'),
    #New Question
    url(r'^quiz/(?P<quiz_id>[0-9]+)/newquestion/$', views.newquestion, name='new_question'),
    #Add New Question
    url(r'^quiz/(?P<quiz_id>[0-9]+)/addquestion/$', views.addquestion, name='create_question'),

    #Try angular
    url(r'^angular/$', views.angular, name='angular'),

    #TODO: Version API
    #TODO: Plural API nouns
    #API
    url(r'^api/quiz/$', api.QuizList.as_view()),
    url(r'^api/quiz/(?P<pk>[0-9]+)/$', api.QuizDetail.as_view()),

    #Load Question list
    url(r'^api/quiz/(?P<pk>[0-9]+)/question/$', api.QuestionList.as_view()),
    url(r'^api/quiz/(?P<pk>[0-9]+)/question/(?P<question_id>[0-9]+)/$', api.QuestionDetail.as_view()),

    #TODO: Clean up no need for question id in choice updates and creates
    #Choice API
    url(r'^api/question/(?P<question_id>[0-9]+)/choice/$', api.ChoiceList.as_view()),
    url(r'^api/question/(?P<question_id>[0-9]+)/choice/(?P<choice_id>[0-9]+)/$', api.ChoiceDetail.as_view()),

    #Get Users that the quiz is not shared with
    url(r'^api/quiz/(?P<quiz_id>[0-9]+)/nonuser/$', api.NonUserList.as_view()),

    #Append user to quiz share
    url(r'^api/quiz/(?P<quiz_id>[0-9]+)/adduser/(?P<user_id>[0-9]+)/$', api.QuizUser.as_view()),

    #Get User
    url(r'^api/user/(?P<user_id>[0-9]+)/$', api.UserDetail.as_view())
]

#allows API end points to provide json or html, Currently not doing much
urlpatterns = format_suffix_patterns(urlpatterns)