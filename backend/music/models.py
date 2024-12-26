from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from django.utils.timezone import now

class BusinessUser(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)
    thumbnail = models.ImageField(upload_to='images/')
    
class User(models.Model):
    username = models.CharField(max_length=100)
    password_hash = models.CharField(max_length=255)
    email = models.CharField(max_length=300)
    avatar = models.ImageField(upload_to='images/avatars/')
    created_at = models.DateTimeField(default=now)
    is_admin = models.BooleanField(default=False)

    def clean(self):
        super().clean()
        # Custom email validation (could be customized further if needed)
        try:
            EmailValidator()(self.email)
        except ValidationError:
            raise ValidationError("Invalid email format.")

class Album(models.Model):
    name = models.CharField(max_length=100)
    artist = models.ForeignKey(BusinessUser, on_delete=models.CASCADE, null=True, blank=True, related_name='music_albums')
    thumbnail = models.ImageField(upload_to='images/album/')

    def save(self, *args, **kwargs):
        if self.pk and self.artist_id != Album.objects.get(pk=self.pk).artist_id:
            raise ValueError("Changing the artist of an album is not allowed.")
        super().save(*args, **kwargs)

def validate_positive(value):
    if value <= 0:
        raise ValidationError("Duration must be a positive integer.")

class Song(models.Model):
    name = models.CharField(max_length=100)
    artist = models.ForeignKey(BusinessUser, on_delete=models.CASCADE, null=True, blank=True, related_name='music_songs')
    duration = models.IntegerField(validators=[validate_positive])
    thumbnail = models.ImageField(upload_to='images/')
    file = models.FileField(upload_to='music/')
    album = models.ForeignKey(Album, on_delete=models.CASCADE, null=True, blank=True, related_name='music_songs')
    release_date = models.DateField(default=now)

class SongListenMetric(models.Model):
    artist = models.ForeignKey(BusinessUser, on_delete=models.CASCADE, null=True, blank=True, related_name='music_songlistenmetric')
    song = models.ForeignKey(Song, on_delete=models.CASCADE, null=True, blank=True, related_name='music_songlistenmetric')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='music_songlistenmetric')
    timestamp = models.DateTimeField(default=now)