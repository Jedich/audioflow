# Generated by Django 5.0.7 on 2024-12-26 14:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0004_song_release_date_alter_song_duration'),
    ]

    operations = [
        migrations.AddField(
            model_name='album',
            name='thumbnail',
            field=models.ImageField(default='images/album/1.jpg', upload_to='images/album/'),
            preserve_default=False,
        ),
    ]
