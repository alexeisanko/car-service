from django.urls import path
from account import views

app_name = 'account'
urlpatterns = [
    path('staff/', views.StaffPageView.as_view(), name='staff'),
    path('profile/', views.UserPageView.as_view(), name='user'),
    path('login/', views.login_user, name='login'),
    path('register/', views.registration_user, name='register'),
    path('logout/', views.UserLogoutView.as_view(), name='logout'),
    path('activate/<uidb64>/<token>', views.confirm_user, name='activate')
]
