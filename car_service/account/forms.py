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
        cleaned_data = super().clean()
        password = cleaned_data['password']
        password2 = cleaned_data
        if password != password2:
            self.add_error('password2', 'Пароли не совпадают')
