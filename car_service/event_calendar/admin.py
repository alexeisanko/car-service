from django.contrib import admin
from event_calendar.models import Events, TypesOfServices, StatusServices, WorkingConditions


class EventsAdmin(admin.ModelAdmin):
    list_display = ('id',
                    'car_id',
                    'client_id',
                    'type_of_service_id',
                    'status_id',
                    'worker_id',
                    'date_begin',
                    'date_finish_plan',
                    'date_finish_fact',
                    'discount')


class TypesOfServicesAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'fixed_repair_time', 'is_available_to_client')


class DiscountAdmin(admin.ModelAdmin):
    list_display = ('date', 'size_discount', 'open_work', 'close_work')


admin.site.register(Events, EventsAdmin)
admin.site.register(TypesOfServices, TypesOfServicesAdmin)
admin.site.register(WorkingConditions, DiscountAdmin)
admin.site.register(StatusServices)
