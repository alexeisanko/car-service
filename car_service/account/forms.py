from django import forms


class LoginForm(forms.Form):
    email = forms.EmailField(required=True)
    password = forms.CharField(required=True)


class RegistrationForm(forms.Form):
    email = forms.EmailField(required=True)
    full_name = forms.CharField(required=True)
    phone = forms.CharField(required=True)
    password = forms.CharField(required=True)
    password2 = forms.CharField(required=True)

    def clean(self):
        super().clean()
        password = self.cleaned_data.get('password')
        password2 = self.cleaned_data.get('password2')
        if password != password2:
            self.add_error('password2', 'Пароли не совпадают')
