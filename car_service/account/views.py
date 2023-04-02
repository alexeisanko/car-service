from django.views.generic import TemplateView
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse_lazy
from event_calendar.models import Events
from site_service.models import Lifts


class StaffPageView(TemplateView):
    template_name = 'account/staff_page.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['lifts'] = Lifts.objects.all()
        return context


class StaffLoginView(LoginView):
    template_name = 'account/staff_login.html'
    next_page = reverse_lazy('account:staff')
    redirect_authenticated_user = True


class StaffLogoutView(LogoutView):
    next_page = reverse_lazy('home_page')
