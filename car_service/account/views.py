from django.views.generic import TemplateView
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse_lazy


class StaffPageView(TemplateView):
    template_name = 'account/staff_page.html'


class StaffLoginView(LoginView):
    template_name = 'account/staff_login.html'
    next_page = reverse_lazy('account:staff')
    redirect_authenticated_user = True


class StaffLogoutView(LogoutView):
    next_page = reverse_lazy('home_page')
