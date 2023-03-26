from django.db import models


class Discounts(models.Model):
    date = models.DateField(verbose_name='Дата')
    size = models.IntegerField(verbose_name='Размер скидки')
    is_active = models.BooleanField(verbose_name='Скидка активна?')

    def __str__(self):
        return f'{self.date} - {self.size} %'

    class Meta:
        verbose_name = 'Скидка'
        verbose_name_plural = 'Скидки'


class TypesOfServices(models.Model):
    name = models.CharField(max_length=40, unique=True, verbose_name='Вид работы')
    price = models.IntegerField(verbose_name='Стоимость')
    fixed_repair_time = models.IntegerField(verbose_name='Стандартное время выполнения работы в минутах')
    description = models.TextField(verbose_name='Описание работы', default="")
    is_available_to_client = models.BooleanField(verbose_name='Доступен для записи клиентом на сайте?', default=False)

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = 'Вид работы'
        verbose_name_plural = 'Виды работ'


class StatusServices(models.Model):
    name = models.CharField(max_length=40, unique=True, verbose_name='Статус работы')

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = 'Статус работы'
        verbose_name_plural = 'Статусы работ'


class Events(models.Model):
    created = models.DateTimeField(verbose_name='Время создания', auto_now_add=True)
    car_id = models.ForeignKey('site_service.Cars', verbose_name='Модель машины', on_delete=models.PROTECT)
    client_id = models.ForeignKey('site_service.Clients', verbose_name='Клиент', on_delete=models.PROTECT)
    type_of_service_id = models.ForeignKey(TypesOfServices, verbose_name='Тип работы', on_delete=models.PROTECT)
    status_id = models.ForeignKey(StatusServices, verbose_name='Статус работы', on_delete=models.PROTECT)
    worker_id = models.ForeignKey('site_service.Workers',
                                  verbose_name='Закрепленный работник',
                                  on_delete=models.PROTECT,
                                  null=True,
                                  blank=True,
                                  default=None,
                                  )
    lift_id = models.ForeignKey('site_service.Lifts',
                                verbose_name='Закрепленный подъемник',
                                on_delete=models.PROTECT,
                                )
    date_begin = models.DateTimeField(verbose_name='Начало работы')
    date_finish_plan = models.DateTimeField(verbose_name='Плановое время окончания')
    date_finish_fact = models.DateTimeField(verbose_name='Фактическое время окончания', blank=True, null=True,
                                            default=None)
    discount = models.IntegerField(verbose_name='Размер скидки', blank=True, default=0)

    def __str__(self):
        return f'№{self.id} от {self.created.strftime("%d.%m.%Y")}'

    class Meta:
        verbose_name = 'Событие'
        verbose_name_plural = 'События'
