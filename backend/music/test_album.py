from django.test import TestCase
from .models import Album, Song, BusinessUser

class AlbumWithoutArtistTest(TestCase):
    def setUp(self):
        self.album = Album.objects.create(name="Album Without Artist")

    def test_album_without_artist(self):
        self.assertIsNone(self.album.artist)
        self.assertEqual(self.album.name, "Album Without Artist")
        
class SongWithoutAlbumTest(TestCase):
    def setUp(self):
        self.artist = BusinessUser.objects.create(
            name="Test Artist",
            description="A test artist description"
        )
        self.song = Song.objects.create(
            name="Orphan Song",
            artist=self.artist,
            duration=210
        )

    def test_song_without_album(self):
        self.assertIsNone(self.song.album)
        self.assertEqual(self.song.artist.name, "Test Artist")
        self.assertEqual(self.song.name, "Orphan Song")
        
class AlbumWithDifferentArtistsTest(TestCase):
    def setUp(self):
        self.artist1 = BusinessUser.objects.create(name="Artist One", description="First test artist")
        self.artist2 = BusinessUser.objects.create(name="Artist Two", description="Second test artist")
        self.album = Album.objects.create(name="Collaborative Album", artist=self.artist1)

    def test_album_artist_uniqueness(self):
        with self.assertRaises(ValueError):
            self.album.artist = self.artist2
            self.album.save()
            
from rest_framework.exceptions import ValidationError
from .serializers import AlbumSerializer

class AlbumSerializerValidationTest(TestCase):
    def test_album_missing_artist(self):
        invalid_data = {"name": "Test Album"}
        serializer = AlbumSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('artist', serializer.errors)
        
class DeletionCascadingTest(TestCase):
    def setUp(self):
        self.artist = BusinessUser.objects.create(
            name="Test Artist",
            description="A test artist description"
        )
        self.album = Album.objects.create(
            name="Test Album",
            artist=self.artist
        )
        self.song = Song.objects.create(
            name="Test Song",
            artist=self.artist,
            duration=250,
            album=self.album
        )

    def test_cascade_delete_artist(self):
        self.artist.delete()
        self.assertFalse(Album.objects.filter(id=self.album.id).exists())
        self.assertFalse(Song.objects.filter(id=self.song.id).exists())
        