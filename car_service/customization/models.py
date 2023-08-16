from django.db import models


class Header(models.Model):
    logo = models.ImageField(verbose_name='логотип', upload_to='header')
    first_header = models.CharField(verbose_name='Первый заголовок', max_length=30)
    second_header = models.CharField(verbose_name='Второй заголовок', max_length=20)
    description = models.TextField(verbose_name='Описание услуги')
    min_price = models.IntegerField(verbose_name='Минимальная цена')

    class Meta:
        verbose_name = 'Предоставляемая услуга'
        verbose_name_plural = "Предоставляемые услуги"


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
    photo = models.ImageField(verbose_name='фото', upload_to='team')

    class Meta:
        verbose_name = 'Команда'
        verbose_name_plural = "Команда"


class Reviews(models.Model):
    name = models.CharField(max_length=40, verbose_name='Имя и фамилия')
    type_service = models.CharField(max_length=30, verbose_name='Тип услуги')
    description = models.TextField(verbose_name='Описание отзыва')
    photo = models.ImageField(verbose_name='фото', upload_to='reviews')

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = "Отзывы"
# Create your models here.
