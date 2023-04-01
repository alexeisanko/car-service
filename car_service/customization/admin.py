from django.contrib import admin
from customization.models import Team, Reviews, DescriptionOfServices


class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'photo')


class ReviewsAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'photo')


class ServiceAdmin(admin.ModelAdmin):
    list_display = ('header', 'description', 'min_price')


admin.site.register(Team, TeamAdmin)
admin.site.register(Reviews, ReviewsAdmin)
admin.site.register(DescriptionOfServices, ServiceAdmin)

# Register your models here.
