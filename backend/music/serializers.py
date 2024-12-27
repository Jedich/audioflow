from rest_framework import serializers
from .models import Song, Album, BusinessUser, User, SongListenMetric, Playlist
from datetime import date

class BusinessUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUser
        fields = ['id', 'name', 'description', 'thumbnail', 'user']
        read_only_fields = ['user']  # Поле user не редагується через API
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Get the base URL for media files from the settings or assume 'http://backend:8000'
        base_url = 'http://backend:8000'

        # Modify the 'thumbnail' field to prepend the backend URL
        if representation.get('thumbnail'):
            # If 'thumbnail' contains 'localhost', replace it with 'backend'
            if 'localhost' in representation['thumbnail']:
                representation['thumbnail'] = representation['thumbnail'].replace('localhost', 'backend')
            # If 'thumbnail' doesn't have a protocol, prepend 'http://backend:8000'
            elif not representation['thumbnail'].startswith('http'):
                representation['thumbnail'] = f"http://backend:8000{representation['thumbnail']}"

        return representation
    
class AlbumSerializer(serializers.ModelSerializer):
    artist = BusinessUserSerializer()

    class Meta:
        model = Album
        fields = ['id', 'name', 'artist', 'thumbnail']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Ensure 'thumbnail' has the full URL with 'http://backend:8000'
        if representation.get('thumbnail'):
            # If 'thumbnail' contains 'localhost', replace it with 'backend'
            if 'localhost' in representation['thumbnail']:
                representation['thumbnail'] = representation['thumbnail'].replace('localhost', 'backend')
            # If 'thumbnail' doesn't have a protocol, prepend 'http://backend:8000'
            elif not representation['thumbnail'].startswith('http'):
                representation['thumbnail'] = f"http://backend:8000{representation['thumbnail']}"

        return representation


class SongSerializer(serializers.ModelSerializer):
    album = serializers.PrimaryKeyRelatedField(queryset=Album.objects.all(), required=False)  # Accept album_id
    artist = serializers.PrimaryKeyRelatedField(queryset=BusinessUser.objects.all())  # Accept artist_id
    release_date = serializers.DateField(default=date.today)

    class Meta:
        model = Song
        fields = ['id', 'name', 'artist', 'duration', 'thumbnail', 'file', 'album', 'release_date']

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Ensure 'thumbnail' follows the given rules
        if representation.get('thumbnail'):
            # If 'thumbnail' contains 'localhost', replace it with 'backend'
            if 'localhost' in representation['thumbnail']:
                representation['thumbnail'] = representation['thumbnail'].replace('localhost', 'backend')
            # If 'thumbnail' doesn't have a protocol, prepend 'http://backend:8000'
            elif not representation['thumbnail'].startswith('http'):
                representation['thumbnail'] = f"http://backend:8000{representation['thumbnail']}"

        # Ensure 'file' follows the given rules
        if representation.get('file'):
            # If 'file' contains 'localhost', replace it with 'backend'
            if 'localhost' in representation['file']:
                representation['file'] = representation['file'].replace('localhost', 'backend')
            # If 'file' doesn't have a protocol, prepend 'http://backend:8000'
            elif not representation['file'].startswith('http'):
                representation['file'] = f"http://backend:8000{representation['file']}"

        return representation


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Ensure 'thumbnail' follows the given rules
        if representation.get('avatar'):
            # If 'thumbnail' contains 'localhost', replace it with 'backend'
            if 'localhost' in representation['avatar']:
                representation['avatar'] = representation['avatar'].replace('localhost', 'backend')
            # If 'thumbnail' doesn't have a protocol, prepend 'http://backend:8000'
            elif not representation['avatar'].startswith('http'):
                representation['avatar'] = f"http://backend:8000{representation['thumbnail']}"

        return representation
    
class SongListenMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = SongListenMetric
        fields = '__all__' 
        
class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True)  # Serialize all songs in the playlist

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'user', 'songs', 'created_at']