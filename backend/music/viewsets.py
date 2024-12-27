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
from .serializers import BusinessUserSerializer, SongSerializer, AlbumSerializer, UserSerializer, SongListenMetricSerializer, PlaylistSerializer
from music.models import Song, BusinessUser, Album, User, SongListenMetric, Playlist
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.http import HttpResponseForbidden
from django.template.loader import render_to_string
from django.urls import get_resolver
import re

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

    # Authenticate user
    user = authenticate(request, email=email, password=password)
    if user is not None:
        # Create JWT Token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return JsonResponse(
            {"message": "Login successful.", "access_token": access_token},
            status=status.HTTP_200_OK
        )
    else:
        return Response({"error": "Invalid email or password."}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({"error": "Username, Email, and Password are required."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)

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
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user  # This will give you the authenticated user
    
    # Get all playlists associated with the authenticated user
    playlists = Playlist.objects.filter(user=user)
    
    # Serialize user and playlists
    user_data = UserSerializer(user).data
    playlists_data = PlaylistSerializer(playlists, many=True).data
    
    artist_data = None
    try:
        artist = BusinessUser.objects.get(user=user)
        artist_data = BusinessUserSerializer(artist).data
    except BusinessUser.DoesNotExist:
        # If the user is not an artist, artist_data remains None
        artist_data = None

    return Response({
        'user': user_data,
        'playlists': playlists_data,
        'artist': artist_data  # Add artist data if present
    })

def get_all_routes():
    # Get the URL resolver
    resolver = get_resolver()
    
    # List of all routes (URLs)
    url_patterns = set()  # Use set to ensure uniqueness

    # Function to recursively gather routes and avoid empty routes
    def traverse(patterns):
        for pattern in patterns:
            # Skip empty or dynamic-only placeholders
            route = str(pattern.pattern)
            if route and route != '/':
                url_patterns.add(route)  # Add to set (ensures uniqueness)
            
            # Check for nested patterns (subviews)
            if hasattr(pattern, 'url_patterns'):
                traverse(pattern.url_patterns)
    
    traverse(resolver.url_patterns)  # Call the recursive function
    return list(url_patterns)  # Convert set back to list to return

def clean_route(route):
    # Remove special characters, leaving alphanumeric and slashes
    return re.sub(r'[^a-zA-Z0-9/]', '', route)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def available_routes(request):
    if not request.user.is_staff:
        return HttpResponseForbidden('You do not have permission to view this page.')

    # Get all routes using the recursive function
    all_routes = get_all_routes()

    # Clean up or format routes if needed (e.g., removing unnecessary placeholders)
    cleaned_routes = [route.strip() for route in all_routes if route.strip()]  # Strip and remove extra empty elements
    # Sort the routes based on their normalized version
    sorted_routes = sorted(cleaned_routes, key=clean_route)

    return Response({
        'routes': sorted_routes
    })