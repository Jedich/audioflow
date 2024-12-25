from django.db import models
from django.core.exceptions import ValidationError

class BusinessUser(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)

class Album(models.Model):
    name = models.CharField(max_length=100)
    artist = models.ForeignKey(BusinessUser, on_delete=models.CASCADE, null=True, blank=True, related_name='music_albums')

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
