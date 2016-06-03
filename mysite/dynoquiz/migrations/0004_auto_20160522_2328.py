# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('dynoquiz', '0003_auto_20151120_0040'),
    ]

    operations = [
        migrations.AddField(
            model_name='choice',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime.now, verbose_name=b'date created'),
        ),
        migrations.AlterField(
            model_name='choice',
            name='question',
            field=models.ForeignKey(related_name='choices', to='dynoquiz.Question'),
        ),
    ]
