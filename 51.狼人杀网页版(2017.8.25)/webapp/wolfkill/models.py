from django.db import models


# Create your models here.
class Gamehall(models.Model):
    player_id = models.IntegerField(null = True)
    room_num = models.CharField(max_length = 4,null = True)
    player_num = models.CharField(max_length = 2,null = True)
    role = models.CharField(max_length = 6,null = True)
    player = models.CharField(max_length = 16, default = '还没加入')
    person_id = models.CharField(max_length = 40,null = True)
    time = models.TimeField(auto_now = True)

    def __str__(self):
        return self.room_num