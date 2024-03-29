import datetime

from event_calendar.models import Events, TypesOfServices, StatusServices
from site_service.models import Lifts, Clients, Cars
from account.models import MyUser
from customization.models import DescriptionOfServices


def get_status_car(registration_number: str) -> str:
    statuses = Events.objects. \
        filter(car_id__registration_number=registration_number, date_finish_fact=None). \
        order_by('date_begin'). \
        only('type_of_service_id__name', 'status_id__name')
    return statuses


def get_events_on_day(year: int, month: int, day: int, lift_id, is_available_to_client=True) -> Events.objects:
    events = Events.objects \
        .filter(lift_id=lift_id) \
        .filter(date_begin__year=year) \
        .filter(date_begin__month=month) \
        .filter(date_begin__day=day) \
        .filter(lift_id__is_available_to_client=is_available_to_client) \
        .order_by('date_begin')
    return events


def get_all_events(lift_id):
    events = Events.objects.filter(lift_id=lift_id)
    return events


def get_one_event(id_event):
    event = Events.objects.get(id=int(id_event))
    return event


def get_lifts(type_service=None, is_available_to_client=True, lift='all', for_staff=False):
    if for_staff:
        if lift == 'all':
            lifts = Lifts.objects.all()
        else:
            lifts = Lifts.objects.filter(id=int(lift))
        return lifts

    is_repair_for_minibus = TypesOfServices.objects.get(name=type_service).is_repair_for_minibus
    if is_repair_for_minibus:
        lifts = Lifts.objects.filter(is_available_to_client=is_available_to_client).filter(
            is_available_to_minibus=is_repair_for_minibus)
    else:
        lifts = Lifts.objects.filter(is_available_to_client=is_available_to_client).order_by('is_available_to_minibus')
    return lifts


def get_duration_service(type_service: str):
    duration = TypesOfServices.objects.get(name=type_service).fixed_repair_time
    return duration


def get_or_create_user(data):
    if MyUser.objects.filter(email=data['email']):
        user, created = Clients.objects.get_or_create(phone=data['phone'],
                                                      defaults={'full_name': data['full_name'], 'email': data['email']})
    else:
        user, created = Clients.objects.get_or_create(phone=data['phone'],
                                                      defaults={'full_name': data['full_name'], 'email': data['email']})
    return user


def get_or_create_car(data):
    car, created = Cars.objects.get_or_create(registration_number=data['registration_number'], model=data['model'],
                                              client_id=data['client'])
    return car


def is_free_lift(year, month, day, lift_id, start_time, end_time):
    # start_time = datetime.datetime.strptime(start_time, '%Y-%m-%dT%H:%M:%S.000+03:00')
    # end_time = datetime.datetime.strptime(end_time, '%Y-%m-%dT%H:%M:%S.000+03:00')
    event_day = Events.objects.filter(lift_id=lift_id) \
        .filter(date_begin__year=year) \
        .filter(date_begin__month=month) \
        .filter(date_begin__day=day)
    if event_day.filter(date_finish_plan__gt=start_time).filter(date_finish_plan__lte=end_time) \
            or event_day.filter(date_begin__gte=start_time).filter(date_begin__lt=end_time)\
            or event_day.filter(date_begin__lte=start_time).filter(date_finish_plan__gte=end_time):
        return False
    return True


def make_new_record(client, car, lift, start_time, end_time, type_service):
    status = StatusServices.objects.get(id=1)
    type_service = TypesOfServices.objects.get(name=type_service)
    event = Events.objects.create(client_id=client, car_id=car, lift_id=lift, date_begin=start_time,
                                  date_finish_plan=end_time, status_id=status, type_of_service_id=type_service)
    event.save()
    return event


def get_all_description_services():
    description_services = DescriptionOfServices.objects.all()
    return description_services
