from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Song
from .serializers import BusinessUserSerializer, SongSerializer, AlbumSerializer, UserSerializer
from music.models import Song, BusinessUser, Album, User

class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [permissions.AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = [permissions.AllowAny]

class ArtistViewSet(viewsets.ModelViewSet):
    queryset = BusinessUser.objects.all()
    serializer_class = BusinessUserSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['get'])
    def songs(self, request, pk=None):
        """
        Custom endpoint to fetch songs and albums for a specific artist.
        """
        try:
            # Filter songs by artist ID
            artist = BusinessUser.objects.get(pk=pk)
            songs = Song.objects.filter(artist_id=pk)
            albums = Album.objects.filter(artist_id=pk)
            
            # Serialize the data
            song_serializer = SongSerializer(songs, many=True)
            album_serializer = AlbumSerializer(albums, many=True)

            return Response({
                "songs": song_serializer.data,
                "albums": album_serializer.data
            })
        except BusinessUser.DoesNotExist:
            return Response({"error": "Artist not found"}, status=404)