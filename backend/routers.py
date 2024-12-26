from rest_framework.routers import SimpleRouter

from music.viewsets import SongViewSet, ArtistViewSet, AlbumViewSet, UserViewSet

router = SimpleRouter()

router.register('songs', SongViewSet)
router.register('artists', ArtistViewSet)
router.register('users', UserViewSet)
router.register('albums', AlbumViewSet)

urlpatterns = router.urls