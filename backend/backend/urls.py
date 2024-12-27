"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from music.viewsets import login_user, register_user, user_profile, available_routes

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/routes/', available_routes, name='available-routes'),
    path("admin/", admin.site.urls),
    path("api/", include(("routers", "core"), namespace="music-api")),
    path('api/user/', user_profile, name='register_user'),
    path('api/login/', login_user, name='login_user'),
    path('api/register/', register_user, name='register_user'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)