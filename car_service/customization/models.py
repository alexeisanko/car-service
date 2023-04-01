from django.db import models


class DescriptionOfServices(models.Model):
    header = models.CharField(max_length=50)
    description = models.TextField(verbose_name='Описание услуги')
    min_price = models.IntegerField(verbose_name='Минимальная цена')

    class Meta:
        verbose_name = 'Предоставляемая услуга'
        verbose_name_plural = "Предоставляемые услуги"


class Team(models.Model):
    name = models.CharField(max_length=40, verbose_name='Имя и фамилия')
    description = models.TextField(verbose_name='Описание сотрудника')
    photo = models.ImageField(verbose_name='фото', upload_to='media/team')

    class Meta:
        verbose_name = 'Команда'
        verbose_name_plural = "Команда"


class Reviews(models.Model):
    name = models.CharField(max_length=40, verbose_name='Имя и фамилия')
    description = models.TextField(verbose_name='Описание отзыва')
    photo = models.ImageField(verbose_name='фото', upload_to='media/reviews')

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = "Отзывы"
# Create your models here.
