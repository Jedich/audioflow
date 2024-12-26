# Generated by Django 5.0.7 on 2024-12-26 20:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0009_songlistenmetric'),
    ]

    operations = [
        migrations.AlterField(
            model_name='songlistenmetric',
            name='artist',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='music_songlistenmetric', to='music.businessuser'),
        ),
        migrations.AlterField(
            model_name='songlistenmetric',
            name='song',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='music_songlistenmetric', to='music.song'),
        ),
        migrations.AlterField(
            model_name='songlistenmetric',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='music_songlistenmetric', to='music.user'),
        ),
    ]
