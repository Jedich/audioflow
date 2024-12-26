from rest_framework.routers import SimpleRouter

from music.viewsets import SongViewSet, ArtistViewSet, AlbumViewSet, UserViewSet, SongListenMetricViewSet

router = SimpleRouter()

router.register('songs', SongViewSet)
router.register('artists', ArtistViewSet)
router.register('users', UserViewSet)
router.register('albums', AlbumViewSet)
router.register('listen_metrics', SongListenMetricViewSet)

urlpatterns = router.urls