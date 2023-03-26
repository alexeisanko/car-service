from django.urls import path
from api import views

app_name = 'api'
urlpatterns = [
    path('check_status/', views.check_status_car, name='check_status'),
    path('make_recording/', views.make_recording, name='make_recording'),
    path('get_free_place/', views.get_free_place, name='get_free_place'),
]
