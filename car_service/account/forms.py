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
