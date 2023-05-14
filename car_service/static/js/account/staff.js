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
        eventClick: function (info) {
            GetEvent(info.event.extendedProps.id_event)
        }

    });
    calendar.render();
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
            $modal.find($("[name='full_name']")).val(data['client'])
            $modal.find($("[name='car']")).val(data['car'])
            $modal.find($("[name='type_service']")).val(data['service'])
            $modal.find($("[name='start_time']")).val(data['start'].slice(0, 16))
            $modal.find($("[name='end_time']")).val(data['end'].slice(0, 16))
            $modal.attr('data', id_event)
        },
    })
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

    $('.modal__close').click(function() {
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
                alert('Событие удалено, не забудь обновить страницу')
            },
        })


    })
})


function DeleteErrors(close_modal = false) {
    $(':input').removeClass('input--error')
    $('.error-message').text("").removeClass('span--error')
    $('.modal__dialog').removeClass('modal__dialog--error')
    if (close_modal) {
        $('.modal').removeClass('modal--visible')
    }
}
