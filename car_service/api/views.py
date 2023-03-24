from django.http import JsonResponse
from api.crud import get_status_car
from django.views.decorators.http import require_POST, require_GET
from api.utilities import find_free_times


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


@require_POST
def make_recording(request):
    response = request.POST


@require_GET
def get_free_times(request):
    response = request.GET
    free_times = find_free_times(response['date'], response['type_service'])

