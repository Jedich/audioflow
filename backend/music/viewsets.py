from rest_framework import viewsets, permissions
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Song
from .serializers import BusinessUserSerializer, SongSerializer, AlbumSerializer, UserSerializer, SongListenMetricSerializer
from music.models import Song, BusinessUser, Album, User, SongListenMetric

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
        
@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({"error": "Email and Password are required."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Try to find the user by email
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Invalid email or password."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Authenticate user
    user = authenticate(request, username=user.username, password=password)
    
    if user is not None:
        login(request, user)  # Log in the user if authenticated
        return JsonResponse({"message": "Login successful."}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid email or password."}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not username or not email or not password:
        return Response({"error": "Username, Email and Password are required."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user already exists
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create new user
    user = User.objects.create(
        username=username,
        email=email,
        password_hash=make_password(password)  # Hash the password before saving
    )
    
    return JsonResponse({"message": "Registration successful!"}, status=status.HTTP_201_CREATED)

class SongListenMetricViewSet(viewsets.ModelViewSet):
    queryset = SongListenMetric.objects.all()
    serializer_class = SongListenMetricSerializer

    def perform_create(self, serializer):
        artist_id = self.request.data.get('artist_id')
        user_id = self.request.data.get('user_id')
        song_id = self.request.data.get('song_id')

        # Retrieve objects based on IDs
        artist = BusinessUser.objects.get(pk=artist_id)
        user = User.objects.get(pk=user_id)
        song = Song.objects.get(pk=song_id)

        # Assign objects to foreign key fields
        serializer.save(artist=artist, user=user, song=song)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)