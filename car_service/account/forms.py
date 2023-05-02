from django import forms
import re


class LoginForm(forms.Form):
    email = forms.EmailField(required=True, )
    password = forms.CharField(required=True)


class RegistrationForm(forms.Form):
    email = forms.EmailField(required=True)
    full_name = forms.CharField(required=True)
    phone = forms.CharField(required=True)
    password = forms.CharField(required=True)
    password2 = forms.CharField(required=True)


class ChangePersonalDataForm(forms.Form):
    email = forms.EmailField(required=False)
    full_name = forms.CharField(required=False)
    phone = forms.CharField(required=False)
    password = forms.CharField(required=False)
    password2 = forms.CharField(required=False)


class AddCarForm(forms.Form):
    model = forms.CharField(required=True)
    registration_number = forms.CharField(required=True)
    is_minibus = forms.BooleanField(required=False)
    vin_number = forms.BooleanField(required=False)
