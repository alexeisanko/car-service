from django.http import JsonResponse
from api.crud import get_status_car
from django.views.decorators.http import require_POST, require_GET
from api import utilities
from api.forms import ChangePersonalDataForm, AddCarForm, ChangeCarInfoForm
from django.shortcuts import redirect
from site_service.models import Lifts, Clients, Cars
from account.models import MyUser


@require_GET
def check_status_car(request):
    response = request.GET
    statuses = get_status_car(response['registration_number'])
    answer = ''
    for status in statuses:
        answer += f"{status.type_of_service_id} - {status.status_id}\n"
    if answer == '':
        answer = 'Такой машины у нас нет, проверьте правильность регистрационного номера'
    return JsonResponse({'statuses': answer})


@require_GET
def make_recording(request):
    response = request.GET
    status = utilities.make_new_record(response)
    return JsonResponse({'status': status})


@require_GET
def get_free_place(request):
    response = request.GET
    free_places = utilities.find_free_place_for_work(response['date'], response['type_service'])
    if free_places:
        return JsonResponse({'status': 'ok', 'free_places': free_places})
    else:
        return JsonResponse({'status': 'error'})


@require_GET
def get_custom_service(request):
    data = utilities.get_description()
    return JsonResponse(data)


@require_GET
def get_events(request):
    response = request.GET
    events = utilities.get_events(response['lift'])
    return JsonResponse(events)


@require_GET
def get_select_event(request):
    response = request.GET
    event = utilities.get_event(response['id_event'])
    return JsonResponse(event)


@require_POST
def change_personal_data(request):
    form = ChangePersonalDataForm(request.POST)
    if form.is_valid():
        MyUser.objects.filter(id=request.user.id).update(email=form.cleaned_data['email'])
        Clients.objects.filter(id=request.user.client_id).update(email=form.cleaned_data['email'],
                                                                 full_name=form.cleaned_data['full_name'],
                                                                 phone=form.cleaned_data['phone'])
        if form.cleaned_data['password']:
            user = MyUser.objects.get(id=request.user.id)
            user.set_password(form.cleaned_data['password'])
            user.save()
        return JsonResponse({'redirect': redirect('account:user').url})
    else:
        errors = [{'error_field': x[0], 'msg': x[1][0]} for x in form.errors.items()]
        return JsonResponse({'errors': errors})


@require_POST
def change_car_info(request):
    form = ChangeCarInfoForm(request.POST)
    if form.is_valid():
        car = Cars.objects.filter(id=form.cleaned_data['car_id']).update(
            model=form.cleaned_data['model'],
            registration_number=form.cleaned_data['registration_number'],
            is_minibus=form.cleaned_data['is_minibus'])
        return JsonResponse({'redirect': redirect('account:user').url})
    else:
        errors = [{'error_field': x[0], 'msg': x[1][0]} for x in form.errors.items()]
        return JsonResponse({'errors': errors})


@require_POST
def add_car(request):
    form = AddCarForm(request.POST)
    if form.is_valid():
        car = Cars.objects.create(
            client_id=request.user.client,
            model=form.cleaned_data['model'],
            registration_number=form.cleaned_data['registration_number'],
            is_minibus=form.cleaned_data['is_minibus'])
        car.save()

        return JsonResponse({'redirect': redirect('account:user').url})
    else:
        errors = [{'error_field': x[0], 'msg': x[1][0]} for x in form.errors.items()]
        return JsonResponse({'errors': errors})


@require_POST
def delete_car(request):
    pass
