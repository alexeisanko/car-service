from django.contrib import admin
from site_service.models import Clients, Cars, Workers


class CarsToClientsAdmin(admin.TabularInline):
    model = Cars
    list_display = ('model', 'registration_number', 'vin_number')


class ClientsAdmin(admin.ModelAdmin):
    inlines = [
        CarsToClientsAdmin
    ]
    list_display = ('first_name', 'phone', 'email')


class CarsAdmin(admin.ModelAdmin):
    list_display = ('model', 'registration_number', 'client_id', 'vin_number', 'is_minibus')


class WorkersAdmin(admin.ModelAdmin):
    pass


admin.site.register(Clients, ClientsAdmin)
admin.site.register(Cars, CarsAdmin)
admin.site.register(Workers, WorkersAdmin)
