from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LogoutView
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect
from account.forms import LoginForm, RegistrationForm
from account import utilities
from site_service.models import Lifts, Clients, Cars
from event_calendar.models import Events


class StaffPageView(LoginRequiredMixin, TemplateView):
    template_name = 'account/staff_page.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['lifts'] = Lifts.objects.all()
        return context


class UserPageView(LoginRequiredMixin, TemplateView):
    template_name = 'account/user_page.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        client = Clients.objects.get(id=self.request.user.client_id)
        context['client'] = client
        context['cars'] = Cars.objects.filter(client_id=client)
        context['events'] = Events.objects.filter(client_id=client)
        return context


def login_user(request):
    form = LoginForm(request.POST)
    if form.is_valid():
        user = authenticate(username=form.cleaned_data['email'], password=form.cleaned_data['password'])
        if user is not None:
            login(request, user)
            if user.is_staff:
                return JsonResponse({'next_page': redirect('account:staff').url})
            else:
                return JsonResponse({'next_page': redirect('account:user').url})


def registration_user(request):
    form = RegistrationForm(request.POST)
    if form.is_valid():
        user = utilities.create_new_user(form.cleaned_data['full_name'],
                                         form.cleaned_data['email'],
                                         form.cleaned_data['phone'],
                                         form.cleaned_data['password']
                                         )
        return JsonResponse({'next_page': redirect('account:user').url})


class UserLogoutView(LoginRequiredMixin, LogoutView):
    pass