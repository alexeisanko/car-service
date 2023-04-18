from django.contrib import admin
from account.models import MyUser


class MyUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'client')


admin.site.register(MyUser, MyUserAdmin)
