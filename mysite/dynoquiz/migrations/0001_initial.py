# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('question_text', models.CharField(max_length=200)),
                ('date_created', models.DateTimeField(verbose_name=b'date created')),
            ],
        ),
        migrations.CreateModel(
            name='Quiz',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('quiz_name', models.CharField(max_length=100)),
                ('date_created', models.DateTimeField(verbose_name=b'date created')),
            ],
        ),
        migrations.AddField(
            model_name='question',
            name='quiz',
            field=models.ForeignKey(to='dynoquiz.Quiz'),
        ),
    ]
