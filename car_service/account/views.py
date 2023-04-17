from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login
from django.urls import reverse_lazy
from event_calendar.models import Events
from site_service.models import Lifts


class StaffPageView(TemplateView):
    template_name = 'account/staff_page.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['lifts'] = Lifts.objects.all()
        return context


class UserPageView(TemplateView):
    template_name = 'account/user_page.html'


def login_all_user(request):
    email = request.POST['email']
    password = request.POST['password']
    user = authenticate(username=email, password=password)
    if user is not None:
        login(request, user)
        return
    return
