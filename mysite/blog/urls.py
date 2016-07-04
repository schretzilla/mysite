from django.conf.urls import url
from . import views
from django.conf.urls import handler400

urlpatterns = [
    #TODO: Uncomment when posting a blog
    
    #url(r'^home/$', views.index, name='index'),
    #url(r'^post/(?P<post_id>[0-9]+)/$', views.post, name='post'),
    #url(r'^about/$', views.about, name='about'),
    #url(r'^projects/$', views.projects, name='projects'),

    #redirect / to home page
    #url(r'^$', views.index, name='index'),
]

