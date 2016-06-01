from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^home/$', views.index, name='index'),
    url(r'^post/(?P<post_id>[0-9]+)/$', views.post, name='post'),
    url(r'^about/$', views.about, name='about'),
    url(r'^projects/$', views.projects, name='projects')



]
