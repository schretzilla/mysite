# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dynoquiz', '0002_choice'),
    ]

    operations = [
        migrations.AddField(
            model_name='choice',
            name='votes',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='quiz',
            name='quiz_details',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
