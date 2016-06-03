from django.conf.urls import patterns, include, url

from . import views

#Rest API
from rest_framework.urlpatterns import format_suffix_patterns
from dynoquiz import api

#added patterns here for api json
urlpatterns = [
    #Home Page
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

    #Choice API
    url(r'^api/question/(?P<question_id>[0-9]+)/choice/$', api.ChoiceList.as_view()),
    url(r'^api/question/(?P<question_id>[0-9]+)/choice/(?P<choice_id>[0-9]+)/$', api.ChoiceDetail.as_view())
]

#allows API end points to provide json or html, Currently not doing much
urlpatterns = format_suffix_patterns(urlpatterns)