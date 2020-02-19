from django.db import models

# Create your models here.
class students_information(models.Model):
    number = models.IntegerField(max_length=99999999999)
    name = models.CharField(max_length=8)
    home_address = models.CharField(max_length=40)