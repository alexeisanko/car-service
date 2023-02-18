from django.urls import path
from site_service import views

urlpatterns = [
    path('', views.HomePageView.as_view()),
]
