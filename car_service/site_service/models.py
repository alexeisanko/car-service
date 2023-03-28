from django.db import models


class Clients(models.Model):
    full_name = models.CharField(max_length=40, verbose_name='Имя')
    phone = models.CharField(unique=True, verbose_name='Номер телефона', max_length=15)
    email = models.EmailField(max_length=254)
    note = models.TextField(verbose_name="Примечание", blank=True, null=True)

    def __str__(self):
        return f'{self.full_name} ({self.phone})'

    class Meta:
        verbose_name = 'Клиент'
        verbose_name_plural = "Клиенты"


class Cars(models.Model):
    client_id = models.ForeignKey(Clients, on_delete=models.PROTECT)
    model = models.CharField(max_length=50, verbose_name='Модель машины')
    is_minibus = models.BooleanField(default=False)
    registration_number = models.CharField(max_length=10, verbose_name='Номер машины')
    vin_number = models.CharField(max_length=100, verbose_name='VIN номер', blank=True)

    def __str__(self):
        return f'{self.model} ({self.registration_number})'

    class Meta:
        verbose_name = 'Машина'
        verbose_name_plural = 'Машины'


class Workers(models.Model):
    name = models.CharField(max_length=40, verbose_name='Имя работника')

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = 'Рабочий'
        verbose_name_plural = 'Рабочие'


class Lifts(models.Model):
    name = models.CharField(max_length=40, verbose_name='Наименование подьемника', unique=True)
    is_available_to_client = models.BooleanField(verbose_name='Доступен для записи клиентом на сайте?',
                                                 default=False)
    is_available_to_minibus = models.BooleanField(verbose_name="Доступен для ремонта минифургонов?", default=False)

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = 'Подъемник'
        verbose_name_plural = 'Подъемники'
