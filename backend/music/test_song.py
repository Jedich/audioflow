from django.test import TestCase
from .models import Album, Song, BusinessUser

class AlbumSongTest(TestCase):
    def setUp(self):
        # Create a BusinessUser instance
        self.artist = BusinessUser.objects.create(
            name="Test Artist", 
            description="A test artist description"
        )

        # Create an Album instance linked to the BusinessUser
        self.album = Album.objects.create(
            name="Test Album",
            artist=self.artist
        )

        # Create a Song instance linked to the Album and BusinessUser
        self.song = Song.objects.create(
            name="Test Song",
            artist=self.artist,
            duration=240,
            thumbnail=None,  # Replace with an actual file if needed for integration tests
            file=None,       # Replace with an actual file if needed for integration tests
            album=self.album
        )

    def test_album_song_relationship(self):
        # Check the song is linked to the correct album
        self.assertEqual(self.song.album, self.album)

        # Check the song is listed in the album's song set
        self.assertIn(self.song, self.album.music_songs.all())

        # Check the song is linked to the correct artist
        self.assertEqual(self.song.artist, self.artist)

        # Check the album is linked to the correct artist
        self.assertEqual(self.album.artist, self.artist)
        
class MultipleSongsInAlbumTest(TestCase):
    def setUp(self):
        self.artist = BusinessUser.objects.create(
            name="Test Artist",
            description="A test artist description"
        )
        self.album = Album.objects.create(
            name="Test Album",
            artist=self.artist
        )
        self.song1 = Song.objects.create(
            name="Song 1",
            artist=self.artist,
            duration=200,
            album=self.album
        )
        self.song2 = Song.objects.create(
            name="Song 2",
            artist=self.artist,
            duration=180,
            album=self.album
        )

    def test_multiple_songs_in_album(self):
        self.assertEqual(self.album.music_songs.count(), 2)
        self.assertIn(self.song1, self.album.music_songs.all())
        self.assertIn(self.song2, self.album.music_songs.all())
        

class LargeNumberOfSongsTest(TestCase):
    def setUp(self):
        self.artist = BusinessUser.objects.create(
            name="Test Artist",
            description="A test artist description"
        )
        self.album = Album.objects.create(
            name="Stress Test Album",
            artist=self.artist
        )
        for i in range(1000):
            Song.objects.create(
                name=f"Song {i+1}",
                artist=self.artist,
                duration=180,
                album=self.album
            )

    def test_album_large_number_of_songs(self):
        self.assertEqual(self.album.music_songs.count(), 1000)
        
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile

class SongDurationTest(TestCase):
    def setUp(self):
        self.artist = BusinessUser.objects.create(name="Test Artist", description="A test artist description")
        self.thumbnail = SimpleUploadedFile(name='test_image.jpg', content=b'', content_type='image/jpeg')
        self.audio_file = SimpleUploadedFile(name='test_audio.mp3', content=b'', content_type='audio/mpeg')

    def test_zero_duration_song(self):
        song = Song(
            name="Invalid Duration Song",
            artist=self.artist,
            duration=0,
            thumbnail=self.thumbnail,
            file=self.audio_file,
        )
        with self.assertRaises(ValidationError) as context:
            song.full_clean()  # Validate constraints without saving

        # Optional: Assert the error message content
        self.assertIn('duration', context.exception.message_dict)
        self.assertEqual(context.exception.message_dict['duration'], ['Duration must be a positive integer.'])

    def test_positive_duration_song(self):
        song = Song.objects.create(
            name="Valid Song",
            artist=self.artist,
            duration=300,
            thumbnail=self.thumbnail,
            file=self.audio_file,
        )
        self.assertEqual(song.duration, 300)