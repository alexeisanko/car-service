# Generated by Django 4.1.7 on 2023-02-20 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('site_service', '0002_alter_cars_options_alter_clients_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cars',
            name='vin_number',
            field=models.CharField(blank=True, max_length=100, verbose_name='VIN номер'),
        ),
    ]