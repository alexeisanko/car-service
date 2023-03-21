from django.urls import path
from api import views

app_name = 'api'
urlpatterns = [
    path('check_status/', views.check_status_car, name='check_status'),
]