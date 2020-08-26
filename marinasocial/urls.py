"""trydjango URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
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

from django.contrib import admin
from django.urls import include, path, re_path
from django.conf.urls import url
from django.views.generic import TemplateView
from frontendOld.views import logout_view, login_view, signup_view
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [

    url(r'^api/auth/', include(
        'rest_framework.urls', namespace='rest_framework')),

    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('logout/', logout_view, name='logout'),
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
    re_path(r'^$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name='index.html')),
]