from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from django.utils.timezone import now
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


    
class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have a username")

        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.set_password(password)  # Use built-in password hashing
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
        user = self.create_user(email, username, password)
        user.is_staff = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=300, unique=True)
    avatar = models.ImageField(upload_to='images/avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_staff = models.BooleanField(default=False)
    is_artist = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
    def has_perm(self, perm, obj=None):
        # Basic implementation allowing superusers or staff to have all permissions
        if self.is_staff:
            return True
        return False
    
    def has_module_perms(self, app_label):
        return self.is_staff  # You can adjust this to your permission logic
    
class BusinessUser(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)
    thumbnail = models.ImageField(upload_to='images/')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')  # the user who owns the playlist

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
    
class Playlist(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists')  # the user who owns the playlist
    songs = models.ManyToManyField(Song, related_name='playlists')  # many-to-many relationship with songs
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class SongListenMetric(models.Model):
    artist = models.ForeignKey(BusinessUser, on_delete=models.CASCADE, null=True, blank=True, related_name='music_songlistenmetric')
    song = models.ForeignKey(Song, on_delete=models.CASCADE, null=True, blank=True, related_name='music_songlistenmetric')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='music_songlistenmetric')
    timestamp = models.DateTimeField(default=now)
    
from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow access to users with is_admin=True.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated and if they are an admin
        return request.user and request.user.is_authenticated and request.user.is_admin