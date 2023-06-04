"use strict";

/* Aside: submenus toggle */
Array.from(document.getElementsByClassName('menu is-menu-main')).forEach(function (el) {
    Array.from(el.getElementsByClassName('has-dropdown-icon')).forEach(function (elA) {
        elA.addEventListener('click', function (e) {
            var dropdownIcon = e.currentTarget.getElementsByClassName('dropdown-icon')[0].getElementsByClassName('mdi')[0];
            e.currentTarget.parentNode.classList.toggle('is-active');
            dropdownIcon.classList.toggle('mdi-plus');
            dropdownIcon.classList.toggle('mdi-minus');
        });
    });
});
/* Aside Mobile toggle */

Array.from(document.getElementsByClassName('jb-aside-mobile-toggle')).forEach(function (el) {
    el.addEventListener('click', function (e) {
        var dropdownIcon = e.currentTarget.getElementsByClassName('icon')[0].getElementsByClassName('mdi')[0];
        document.documentElement.classList.toggle('has-aside-mobile-expanded');
        dropdownIcon.classList.toggle('mdi-forwardburger');
        dropdownIcon.classList.toggle('mdi-backburger');
    });
});
/* NavBar menu mobile toggle */

Array.from(document.getElementsByClassName('jb-navbar-menu-toggle')).forEach(function (el) {
    el.addEventListener('click', function (e) {
        var dropdownIcon = e.currentTarget.getElementsByClassName('icon')[0].getElementsByClassName('mdi')[0];
        document.getElementById(e.currentTarget.getAttribute('data-target')).classList.toggle('is-active');
        dropdownIcon.classList.toggle('mdi-dots-vertical');
        dropdownIcon.classList.toggle('mdi-close');
    });
});
/* Modal: open */

Array.from(document.getElementsByClassName('jb-modal')).forEach(function (el) {
    el.addEventListener('click', function (e) {
        var modalTarget = e.currentTarget.getAttribute('data-target');
        document.getElementById(modalTarget).classList.add('is-active');
        document.documentElement.classList.add('is-clipped');
    });
});
/* Modal: close */

Array.from(document.getElementsByClassName('jb-modal-close')).forEach(function (el) {
    el.addEventListener('click', function (e) {
        e.currentTarget.closest('.modal').classList.remove('is-active');
        document.documentElement.classList.remove('is-clipped');
    });
});
/* Notification dismiss */

Array.from(document.getElementsByClassName('jb-notification-dismiss')).forEach(function (el) {
    el.addEventListener('click', function (e) {
        e.currentTarget.closest('.notification').classList.add('is-hidden');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendar');
    GetCalendar(calendarEl, 'all')
});

function GetCalendar(calendarEl, lift) {
    $.ajax({
        type: 'GET',
        url: '/api/get_events/',
        dataType: 'json',
        data: {
            'lift': lift,
        },
        success: function (data) {
            RenderCalendar(calendarEl, data['events'])
        },
    })
}

function RenderCalendar(calendarEl, events) {
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        initialDate: new Date().toISOString().slice(0, 10),
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: events,
        navLinks: true,
        eventClick: function (info) {
            GetEvent(info.event.extendedProps.id_event)
        },
        dateClick: function (info) {
            MakeNewEvent(info.dateStr)
        },
        navLinkDayClick: function (date) {
            GetWorkingConditions(date.toISOString())
        }
    });
    calendar.render();
}

function MakeNewEvent(date) {
    let $modal = $('.modal__new-event')
        $('.type_service').val(null)
        $('.select_client').val(null)
        $('.select_car').val(null)
        $('.name_client').text(null)
        $('.phone_client').text(null)
        $('.email_client').text(null)
        $('.name_service').text(null)
        $('.time_working').text(null)
        $('.cost_work').text(null)
        $('.model_car').text(null)
        $('.number_car').text(null)
        $('.vin_car').text(null)
        $modal.addClass('modal--visible');
}

function GetEvent(id_event) {
    $.ajax({
        type: 'GET',
        url: '/api/get_select_event/',
        dataType: 'json',
        data: {
            'id_event': id_event,
        },
        success: function (data) {
            let $modal = $('.modal__change-event')
            $modal.addClass('modal--visible');
            $modal.find($('.name_client')).text(data['client'])
            $modal.find($('.car_client')).text(data['car'])
            $modal.find($('.type_service')).text(data['service'])
            $modal.find($("[name='start_time_plan']")).val(data['start_plan'].slice(0, 16))
            $modal.find($("[name='end_time_plan']")).val(data['end_plan'].slice(0, 16))
            if (data['start_fact']) {
                $modal.find($("[name='start_time_fact']")).val(data['start_fact'].slice(0, 16))
            }
            if (data['end_fact']) {
                $modal.find($("[name='end_time_fact']")).val(data['end_fact'].slice(0, 16))
            }
            $modal.find($("[name='status']")).val(data['status_service'])
            $modal.find($("[name='worker']")).val(data['worker'])
            $modal.find($("[name='event_id']")).val(id_event)
            $modal.attr('data', id_event)
        },
    })
}

function GetWorkingConditions(date) {
    $.ajax({
        type: 'GET',
        url: '/api/get_working_conditions/',
        dataType: 'json',
        data: {
            'date': date.slice(0,10),
        },
        success: function (data) {
            let $modal = $('.modal__change_work')
            $modal.addClass('modal--visible');
            $modal.find($('.modal__title')).text(`Условия работы ${date.slice(0,10)}`)
            if (data) {
                console.log(data)
                $modal.find($("[name='open_time']")).val(data['open'])
                $modal.find($("[name='close_time']")).val(data['close'])
                $modal.find($("[name='discount']")).val(data['discount'])
            } else {
                $modal.find($("[name='open_time']")).val(none)
                $modal.find($("[name='close_time']")).val(none)
                $modal.find($("[name='discount']")).val(none)
            }
        },
    })
}

function DeleteErrors(close_modal = false) {
    $(':input').removeClass('input--error')
    $('.error-message').text("").removeClass('span--error')
    $('.modal__dialog').removeClass('modal__dialog--error')
    if (close_modal) {
        $('.modal').removeClass('modal--visible')
    }
}

function MessageEvent(event) {
        $('.modal__message').addClass('modal--visible');
        $('.text-message-modal').text(event['msg'])
    }

$(document).ready(function () {
    $('.lift').on('click', 'a', function () {
        let lift = $(this).attr('id')
        if (document.getElementById('calendar')) {
            let calendarEl = document.getElementById('calendar');
            GetCalendar(calendarEl, lift)
        } else {
            $.ajax({
                type: 'GET',
                url: '/account/staff-lifts',
                success: function (data) {
                    $('.is-main-section').html(data)
                    let calendarEl = document.getElementById('calendar');
                    GetCalendar(calendarEl, lift)
                },
            })

        }
    })

    $('.staff-forms').on('click', function () {
        $.ajax({
            type: 'GET',
            url: '/account/staff-forms',
            success: function (data) {
                $('.is-main-section').html(data)
            },
        })
    })

    $('.staff-profile').on('click', function () {
        $.ajax({
            type: 'GET',
            url: '/account/staff-profile',
            success: function (data) {
                $('.is-main-section').html(data)
            },
        })
    })

    $('.modal__close').click(function () {
        DeleteErrors(true)
    });

    $('#delete-event').click(function (e) {
        e.preventDefault()
        $.ajax({
            type: 'GET',
            url: '/api/delete-event/',
            dataType: 'json',
            data: {"event_id": $('.modal__change-event').attr('data')},
            success: function (data) {
                DeleteErrors(true)
                MessageEvent({'msg': 'Событие удалено, не забудь обновить страницу'})
            },
        })
    })

    $('#delete-conditions').click(function (e) {
        e.preventDefault()
        let $modal = $('.modal__change_work')
        let date = $modal.find($('.modal__title')).text().slice(15, 25)
        $.ajax({
            type: 'GET',
            url: '/api/clean_working_conditions/',
            dataType: 'json',
            data: {"date": date},
            success: function (data) {
                DeleteErrors(true)
                MessageEvent({'msg': 'Условия работы удалены'})
            },
        })
    })

    $('.modal').on("submit", "form", function (e) {
        e.preventDefault()
        DeleteErrors()
        let $form = $(this);
        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            dataType: 'json',
            data: $form.serialize(),
            success: function (data) {
                if (data['errors']) {
                    let field
                    let message
                    for (let error in data['errors']) {
                        field = $form.find($(`[name='${data['errors'][error]['error_field']}']`))
                        field.addClass('input--error')
                        message = field.next()
                        message.text(data['errors'][error]['msg']).addClass('span--error')
                    }
                    $('.modal__dialog').addClass('modal__dialog--error')
                } else if (data['redirect']) {
                    DeleteErrors()
                    location.replace(data['redirect'])
                } else if (data['passed']) {
                    $('.modal').removeClass('modal--visible')
                    DeleteErrors()
                    MessageEvent(data['passed'])
                }
            },
            error: function () {
                MessageEvent({'msg': 'Ошибка сервера. Попробуйте попозже'})
            }
        })
        return false
    })

    $('.type_service').on("input", function () {
        let select_service = $(this).val()
        for ( let service of services) {
            if (service['pk'] == select_service) {
                $('.name_service').text(service['fields']['name'])
                $('.time_working').text(`Время выполнения: ${service['fields']['fixed_repair_time']} мин.`)
                if (service['fields']['is_fixed_price']) {
                    $('.cost_work').text(`Цена: ${service['fields']['price']} руб`)
                } else {
                    $('.cost_work').text(`Цена: от ${service['fields']['price']} руб`)
                }
                break
            }
            $('.name_service').text(null)
            $('.time_working').text(null)
            $('.cost_work').text(null)
        }
    })

    $('.select_client').on("input", function () {
        let select_client = $(this).val()
        for (let client of clients) {
            if (client['pk'] == select_client) {
                $('.name_client').text(client['fields']['full_name'])
                $('.phone_client').text(client['fields']['phone'])
                $('.email_client').text(client['fields']['email'])
                break
            }
            $('.name_client').text(null)
            $('.phone_client').text(null)
            $('.email_client').text(null)
        }
    })

    $('.select_car').on("input", function () {
        let select_car = $(this).val()
        for (let car of cars) {
            if (car['pk'] == select_car) {
                $('.model_car').text(car['fields']['model'])
                $('.number_car').text(car['fields']['registration_number'])
                $('.vin_car').text(car['fields']['vin_number'])
                break
            }
            $('.model_car').text(null)
            $('.number_car').text(null)
            $('.vin_car').text(null)
        }
    })
})
