from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LogoutView
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect
from django.contrib import messages
from django.core import serializers
from account.forms import LoginForm, RegistrationForm
from account import utilities
from site_service.models import Lifts, Clients, Cars, Workers
from customization.models import Header
from event_calendar.models import Events, StatusServices, TypesOfServices


class StaffPageView(LoginRequiredMixin, TemplateView):
    template_name = 'account/staff/index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['lifts'] = Lifts.objects.all()
        context['workers'] = Workers.objects.all()
        context['cars'] = Cars.objects.all()
        context['clients'] = Clients.objects.all()
        context['statuses'] = StatusServices.objects.all()
        context['services'] = TypesOfServices.objects.all()
        context['cars_json'] = serializers.serialize('json', Cars.objects.all())
        context['clients_json'] = serializers.serialize('json', Clients.objects.all())
        context['services_json'] = serializers.serialize('json', TypesOfServices.objects.all())
        context['headers'] = Header.objects.first()
        return context


class StaffPageFormsView(LoginRequiredMixin, TemplateView):
    template_name = 'account/staff/forms.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['lifts'] = Lifts.objects.all()
        return context


class StaffPageLiftsView(LoginRequiredMixin, TemplateView):
    template_name = 'account/staff/lifts.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['lifts'] = Lifts.objects.all()
        return context


class StaffPageProfileView(LoginRequiredMixin, TemplateView):
    template_name = 'account/staff/profile.html'

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
                return JsonResponse({'redirect': redirect('account:staff').url})
            else:
                return JsonResponse({'redirect': redirect('account:user').url})
        return JsonResponse({'errors': [{'error_field': 'email', 'msg': 'Некорректный email или пароль'}]})
    else:
        errors = [{'error_field': x[0], 'msg': x[1][0]} for x in form.errors.items()]
        return JsonResponse({'errors': errors})


def registration_user(request):
    form = RegistrationForm(request.POST)
    if form.is_valid():
        user = utilities.create_new_user(form.cleaned_data['full_name'],
                                         form.cleaned_data['email'],
                                         form.cleaned_data['phone'],
                                         form.cleaned_data['password']
                                         )
        utilities.activate_email(request, user, form.cleaned_data['email'], form.cleaned_data['full_name'])
        return JsonResponse({'passed': {
            'request': 'confirm account',
            'msg': 'Для завершения регистрации перейдите на веденную почту и подтвердите данные'
            }
        })
    else:
        errors = [{'error_field': x[0], 'msg': x[1][0]} for x in form.errors.items()]
        return JsonResponse({'errors': errors})


def confirm_user(request, uidb64, token):
    is_confirm_email = utilities.activate_user(uidb64, token)
    if is_confirm_email:
        messages.success(request, "Thank you for your email confirmation. Now you can login your account.")
    else:
        messages.error(request, "Activation link is invalid!")
    return redirect('home_page')


class UserLogoutView(LoginRequiredMixin, LogoutView):
    pass
