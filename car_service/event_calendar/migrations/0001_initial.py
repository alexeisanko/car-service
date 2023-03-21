# Generated by Django 4.1.7 on 2023-02-20 19:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('site_service', '0003_alter_cars_vin_number'),
    ]

    operations = [
        migrations.CreateModel(
            name='Discounts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(verbose_name='Дата')),
                ('size', models.IntegerField(verbose_name='Размер скидки')),
                ('is_active', models.BooleanField(verbose_name='Скидка активна?')),
            ],
            options={
                'verbose_name': 'Скидка',
                'verbose_name_plural': 'Скидки',
            },
        ),
        migrations.CreateModel(
            name='StatusServices',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40, unique=True, verbose_name='Статус работы')),
            ],
            options={
                'verbose_name': 'Статус работы',
                'verbose_name_plural': 'Статусы работ',
            },
        ),
        migrations.CreateModel(
            name='TypesOfServices',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40, unique=True, verbose_name='Вид работы')),
                ('price', models.IntegerField(verbose_name='Стоимость')),
                ('fixed_repair_time', models.TimeField(verbose_name='Стандартное время выполнения работы')),
                ('is_available_to_client', models.BooleanField(verbose_name='Доступен для бронирования клиентом на сайте?')),
            ],
            options={
                'verbose_name': 'Вид работы',
                'verbose_name_plural': 'Виды работ',
            },
        ),
        migrations.CreateModel(
            name='Events',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Время создания')),
                ('date_begin', models.DateTimeField(verbose_name='Начало работы')),
                ('date_finish_plan', models.DateTimeField(verbose_name='Плановое время окончания')),
                ('date_finish_fact', models.DateTimeField(default=None, null=True, verbose_name='Фактическое время окончания')),
                ('discount', models.IntegerField(default=None, null=True, verbose_name='Размер скидки')),
                ('car_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='site_service.cars', verbose_name='Модель машины')),
                ('client_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='site_service.clients', verbose_name='Клиент')),
                ('status_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='event_calendar.statusservices', verbose_name='Статус работы')),
                ('type_of_service_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='event_calendar.typesofservices', verbose_name='Тип работы')),
                ('worker_id', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.PROTECT, to='site_service.workers', verbose_name='Закрепленный работник')),
            ],
            options={
                'verbose_name': 'Событие',
                'verbose_name_plural': 'События',
            },
        ),
    ]
