from django.urls import path
from account import views

app_name = 'account'
urlpatterns = [
    path('staff/', views.StaffPageView.as_view(), name='staff'),
    path('profile/', views.StaffUserView.as_view(), name='user'),
    path('staff-login/', views.StaffLoginView.as_view(), name='staff_login'),
    path('staff-logot/', views.StaffLogoutView.as_view(), name='staff_logout'),

]
