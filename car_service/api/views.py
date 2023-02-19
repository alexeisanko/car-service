from django.http import JsonResponse
from api.crud import get_status_car
from django.views.decorators.http import require_POST


@require_POST
def check_status_car(request):
    response = request.POST
    statuses = get_status_car(response['registration_number'])
    answer = ''
    for status in statuses:

        answer += f"{status.type_of_service_id} - {status.status_id}\n"
    return JsonResponse({'statuses': answer})
