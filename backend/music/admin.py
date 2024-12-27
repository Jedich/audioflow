from django.contrib import admin

from .models import Song, BusinessUser, Album, User, SongListenMetric, Playlist

admin.site.register(Song)
admin.site.register(BusinessUser)
admin.site.register(Album)
admin.site.register(User)
admin.site.register(Playlist)