from event_calendar.models import Events, TypesOfServices


def get_status_car(registration_number: str) -> str:
    statuses = Events.objects.\
        filter(car_id__registration_number=registration_number, date_finish_fact=None).\
        order_by('date_begin').\
        only('type_of_service_id__name', 'status_id__name')
    return statuses


def get_all_event_day(year: int, month: int, day: int, type_service: str) -> Events.objects:
    events = Events.objects\
        .filter(date_begin__year=year)\
        .filter(date_begin__month=month)\
        .filter(date_begin__day=day)\
        .filter(type_of_service_id__name=type_service)
    return events


def get_duration_service(type_service: str):
    duration = TypesOfServices.objects.get(name=type_service).fixed_repair_time
    return duration



