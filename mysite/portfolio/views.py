from django.shortcuts import render

def home(request):
    return render(request, 'portfolio/home.html', context=None)

def self_help(request):
    return render(request, 'portfolio/self-help.html', context=None)