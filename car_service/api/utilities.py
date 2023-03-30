from api import crud
from datetime import datetime


def find_free_place_for_work(date: str, type_service: str) -> dict:
    open_hour, close_hour = 8, 17
    year, month, day = int(date[0: 4]), int(date[5: 7]), int(date[8:])
    time_open = int(datetime(year, month, day, open_hour).timestamp())
    time_close = int(datetime(year, month, day, close_hour).timestamp())
    duration_of_work = crud.get_duration_service(type_service) * 60
    lifts = crud.get_all_lift(type_service)
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


def _find_free_lift(start_time, end_time, type_service):
    lifts = crud.get_all_lift(type_service)
    year, month, day = int(start_time[0: 4]), int(start_time[5: 7]), int(start_time[8: 10])
    for lift in lifts:
        if crud.is_free_lift(year, month, day, lift.id, start_time, end_time):
            return lift
    return 'error', 'free lift not found'
