from django.urls import path
from api import views

app_name = 'api'
urlpatterns = [
    path('check_status/', views.check_status_car, name='check_status'),
    path('make_recording/', views.make_recording, name='make_recording'),
    path('get_free_place/', views.get_free_place, name='get_free_place'),
    path('get_custom_service/', views.get_custom_service, name='get_custom_service'),
    path('get_events/', views.get_events, name='get_events'),
    path('change_event/', views.change_event, name='change_event'),
    path('get_select_event/', views.get_select_event, name='get_select_event'),
    path('get_working_conditions/', views.get_working_conditions, name='get_working_conditions'),
    path('delete-event/', views.delete_event, name='delete_event'),
    path('change_personal_data', views.change_personal_data, name='change-personal-data'),
    path('add_car/', views.add_car, name='add_car'),
    path('delete-car/', views.delete_car, name='delete_car'),
    path('change_car_info/', views.change_car_info, name='change_car_info'),
]
