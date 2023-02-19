from event_calendar.models import Events


def get_status_car(registration_number: str) -> str:
    statuses = Events.objects.\
        filter(car_id__registration_number=registration_number, date_finish_fact=None).\
        order_by('date_begin').\
        only('type_of_service_id__name', 'status_id__name')
    return statuses



