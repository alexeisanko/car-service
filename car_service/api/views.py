from django.http import JsonResponse
from api.crud import get_status_car
from django.views.decorators.http import require_POST, require_GET
from api import utilities


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

