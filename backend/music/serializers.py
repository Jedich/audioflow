from rest_framework import serializers
from .models import Song, Album, BusinessUser

class BusinessUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUser
        fields = ['id', 'name', 'description']

class AlbumSerializer(serializers.ModelSerializer):
    artist = BusinessUserSerializer()

    class Meta:
        model = Album
        fields = ['id', 'name', 'artist']

class SongSerializer(serializers.ModelSerializer):
    album = AlbumSerializer()
    artist = BusinessUserSerializer()

    class Meta:
        model = Song
        fields = ['id', 'name', 'artist', 'duration', 'thumbnail', 'file', 'album']
