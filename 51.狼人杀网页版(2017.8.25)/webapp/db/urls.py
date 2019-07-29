from django.conf.urls import url
from . import views as db_views


urlpatterns = [
    url(r'^$', db_views.display),
]