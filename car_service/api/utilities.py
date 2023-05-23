from api import crud
from datetime import datetime
import datetime as dt


def find_free_place_for_work(date: str, type_service: str) -> dict:
    open_hour, close_hour = 8, 17
    year, month, day = int(date[0: 4]), int(date[5: 7]), int(date[8:])
    time_open = int(datetime(year, month, day, open_hour).timestamp())
    time_close = int(datetime(year, month, day, close_hour).timestamp())
    duration_of_work = crud.get_duration_service(type_service) * 60
    lifts = crud.get_lifts(type_service)
    free_places = []
    for lift in lifts:
        free_times = get_free_times(year, month, day, lift.id, time_open, time_close)
        for free_time in free_times:
            free_places.extend([(
                datetime.fromtimestamp(x).isoformat(sep='T'),
                datetime.fromtimestamp(x + duration_of_work).isoformat(sep='T')
            ) for x in range(free_time[0], free_time[1], 30 * 60) if x + duration_of_work <= free_time[1]])
    free_places = list(set(free_places))
    free_places.sort(key=lambda x: x[0])
    free_places = [{'title': 'Свободно', 'start': x[0], 'end': x[1]} for x in free_places]
    return free_places


def get_free_times(year, month, day, lift_id, time_open, time_close):
    free_times = []
    time_current = time_open
    events = crud.get_events_on_day(year, month, day, lift_id=lift_id)
    for event in events:
        time_begin_work = int(event.date_begin.timestamp())
        time_end_work = int(event.date_finish_plan.timestamp())
        if time_current < time_begin_work:
            free_times.append([time_current, time_begin_work])
        elif time_current == time_begin_work:
            if free_times:
                free_times[-1][1] = time_end_work
        time_current = time_end_work
    else:
        if time_current < time_close:
            free_times.append([time_current, time_close])
    return free_times


def make_new_record(data):
    user_data = {'full_name': data['name'], 'phone': data['phone'], 'email': data['email']}
    client = crud.get_or_create_user(user_data)
    car_data = {'model': data['model'], 'registration_number': data['number_car'], 'client': client}
    car = crud.get_or_create_car(car_data)
    lift = _find_free_lift(data['start_time'], data['end_time'], data['service'])
    new_record = crud.make_new_record(client, car, lift, data['start_time'], data['end_time'], data['service'])
    return True


def _find_free_lift(start_time, end_time, type_service):
    lifts = crud.get_lifts(type_service)
    year, month, day = int(start_time[0: 4]), int(start_time[5: 7]), int(start_time[8: 10])
    for lift in lifts:
        if crud.is_free_lift(year, month, day, lift.id, start_time, end_time):
            return lift
    return 'error', 'free lift not found'


def get_description():
    all_services = crud.get_all_description_services()
    processed_data = {
        f'custom_service_id{x.id}': {'header': x.header, 'description': x.description, 'min_price': x.min_price} for x
        in all_services}
    return processed_data


def get_events(lift_number: str):
    lift_id = lift_number if lift_number == 'all' else lift_number.split('_')[1]
    lifts = crud.get_lifts(for_staff=True, lift=lift_id)
    events = []
    colors = ['blue', 'green', 'read', 'brown', 'purple', 'yellow', 'black', 'pink']
    for i, lift in enumerate(lifts):
        lift_events = crud.get_all_events(lift.id)
        events.extend(
            [{'title': event.type_of_service_id.name,
              'start': event.date_begin.isoformat(),
              'end': event.date_finish_plan.isoformat(),
              'color': colors[i],
              'id_event': event.id} for
             event in lift_events])
    return {'status': 'ok', 'events': events}


def get_event(id_event):
    event = crud.get_one_event(id_event)
    clean_event = {'client': f'{event.client_id.full_name} ({event.client_id.phone})',
                  'car': f'{event.car_id.model} ({event.car_id.registration_number})',
                  'service': event.type_of_service_id.name,
                  'start_plan': event.date_begin + dt.timedelta(hours=3),
                  'end_plan': event.date_finish_plan + dt.timedelta(hours=3),
                  'status_service': event.status_id.name,
                }
                
    if event.date_begin_fact:
        clean_event['start_fact'] = event.date_begin_fact + dt.timedelta(hours=3)
    if event.date_finish_fact:
        clean_event['end_fact'] = event.date_finish_fact + dt.timedelta(hours=3)
    if event.worker_id:
        clean_event['worker'] = event.worker_id.name
    return clean_event
