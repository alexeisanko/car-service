from api import crud


def find_free_times(date: str, type_service: str) -> dict:
    year = int(date[0: 4])
    month = int(date[5: 7])
    day = int(date[8:])
    events = crud.get_all_event_day(year, month, day, type_service)
    duration_of_work = crud.get_duration_service(type_service)
    return events

