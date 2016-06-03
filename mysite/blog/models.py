from __future__ import unicode_literals

from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)
    sub_heading = models.CharField(max_length=300)
    pub_date = models.DateTimeField('date published')
    text = models.TextField(default='Blog post goes here :)')
    header_image_path = models.FilePathField(path='blog/img', default='zilla-bg.png')
