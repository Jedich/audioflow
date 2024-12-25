from rest_framework import viewsets, permissions

from music.models import Song, BusinessUser
from music.serializers import SongSerializer, BusinessUserSerializer


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [permissions.AllowAny]

class ArtistViewSet(viewsets.ModelViewSet):
    queryset = BusinessUser.objects.all()
    serializer_class = BusinessUserSerializer
    permission_classes = [permissions.AllowAny]