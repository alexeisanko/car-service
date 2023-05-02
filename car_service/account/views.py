from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LogoutView
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect
from django.contrib import messages
from account.forms import LoginForm, RegistrationForm, ChangePersonalDataForm, AddCarForm
from account.models import MyUser
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
        return JsonResponse({'error': 'invalid email or password'})


def registration_user(request):
    form = RegistrationForm(request.POST)
    if form.is_valid():
        user = utilities.create_new_user(form.cleaned_data['full_name'],
                                         form.cleaned_data['email'],
                                         form.cleaned_data['phone'],
                                         form.cleaned_data['password']
                                         )
        utilities.activate_email(request, user, form.cleaned_data['email'], form.cleaned_data['full_name'])
        return JsonResponse({'registration ok': "Проверь почту"})
    else:
        return JsonResponse({'error': "invalid data"})


def confirm_user(request, uidb64, token):
    is_confirm_email = utilities.activate_user(uidb64, token)
    if is_confirm_email:
        messages.success(request, "Thank you for your email confirmation. Now you can login your account.")
    else:
        messages.error(request, "Activation link is invalid!")
    return redirect('home_page')


def change_personal_data(request):
    form = ChangePersonalDataForm(request.POST)
    if form.is_valid():
        MyUser.objects.filter(id=request.user.id).update(email=form.cleaned_data['email'])
        Clients.objects.filter(id=request.user.client_id).update(email=form.cleaned_data['email'],
                                                                 full_name=form.cleaned_data['full_name'],
                                                                 phone=form.cleaned_data['phone'])
        return JsonResponse({'next_page': redirect('account:user').url})
    return JsonResponse({'error': "invalid data"})


def add_car(request):
    form = AddCarForm(request.POST)
    if form.is_valid():
        car = Cars.objects.create(
            client_id=request.user.client,
            model=form.cleaned_data['model'],
            registration_number=form.cleaned_data['registration_number'],
            is_minibus=form.cleaned_data['is_minibus'])
        car.save()

        return JsonResponse({'next_page': redirect('account:user').url})
    else:
        return JsonResponse({'error': "invalid data"})


class UserLogoutView(LoginRequiredMixin, LogoutView):
    pass
