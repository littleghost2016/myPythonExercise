from django.conf.urls import url
from . import views as wolfkill_views

urlpatterns = [
    url(r'^$', wolfkill_views.index),
    url(r'^create_game/(?P<room_num>\d+)$', wolfkill_views.create_game, name='create_game'),
    url(r'^join_game/$', wolfkill_views.join_game, name='join_game'),
]