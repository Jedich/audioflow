# Generated by Django 5.0.7 on 2024-12-26 23:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0011_remove_user_password_hash_user_last_login_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='is_admin',
            new_name='is_staff',
        ),
    ]
