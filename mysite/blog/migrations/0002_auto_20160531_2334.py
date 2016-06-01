# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-05-31 23:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='header_image_path',
            field=models.FilePathField(default='zilla-bg.png', path='blog/img'),
        ),
        migrations.AddField(
            model_name='post',
            name='text',
            field=models.TextField(default='Blog post goes here :)'),
        ),
    ]