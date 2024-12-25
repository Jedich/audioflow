from rest_framework.routers import SimpleRouter

from music.viewsets import SongViewSet, ArtistViewSet

router = SimpleRouter()

router.register('songs', SongViewSet)
router.register('artists', ArtistViewSet)

urlpatterns = router.urls