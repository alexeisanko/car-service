from django.urls import path
from account import views

app_name = 'account'
urlpatterns = [
    path('staff/', views.StaffPageView.as_view(), name='staff'),
    path('profile/', views.UserPageView.as_view(), name='user'),
    path('login/', views.login_all_user, name='login'),
]
