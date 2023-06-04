from django import forms


class StaffMakeEventForm(forms.Form):
    client = forms.IntegerField(required=True)
    lift = forms.CharField(required=True)
    car = forms.IntegerField(required=True)
    type_service = forms.IntegerField(required=True)
    start_time_plan = forms.DateTimeField(required=True)
    end_time_plan = forms.DateTimeField(required=True)
    worker = forms.CharField(required=False)
    note = forms.CharField(required=False)


class ChangePersonalDataForm(forms.Form):
    email = forms.EmailField(required=False)
    full_name = forms.CharField(required=False)
    phone = forms.CharField(required=False)
    password = forms.CharField(required=False)
    password2 = forms.CharField(required=False)

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data['password']:
            password = cleaned_data['password']
            password2 = cleaned_data['password2']
            if password != password2:
                self.add_error('password2', 'Пароли не совпадают')
            elif not password2:
                self.add_error('password2', 'Повторите пароль')


class AddCarForm(forms.Form):
    model = forms.CharField(required=True)
    registration_number = forms.CharField(required=True)
    is_minibus = forms.BooleanField(required=False)
    vin_number = forms.CharField(required=False)


class ChangeCarInfoForm(forms.Form):
    model = forms.CharField(required=True)
    registration_number = forms.CharField(required=True)
    is_minibus = forms.BooleanField(required=False)
    vin_number = forms.CharField(required=False)
    car_id = forms.CharField(required=True)


class StatusCarForm(forms.Form):
    registration_number = forms.CharField(required=True)
