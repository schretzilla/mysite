from django.shortcuts import render
from django.http import HttpResponse
from .models import Post


def index(request):
    post_list = Post.objects.all()
    context = { 'post_list' : post_list }
    return render(request, 'blog/index.html', context)

def post(request, post_id):
    post = Post.objects.get(pk=post_id)
    context = {'post':post}
    return render(request, 'blog/post.html', context)

def projects(request):
    return render(request, 'blog/projects.html')

def about(request):
    return render(request, 'blog/about.html')
