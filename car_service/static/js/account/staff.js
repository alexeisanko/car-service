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
            alert(
                `Client: ${data['client']}\n
Car: ${data['car']}\n
Service: ${data['service']}\n
Start: ${data['start']}\n
End: ${data['end']}`
            )
        },
    })
}

$(document).ready(function () {
    $('.lift').on('click', 'a', function (event) {
        event.preventDefault()
        let calendarEl = document.getElementById('calendar');
        let lift = $(this).attr('id')
        GetCalendar(calendarEl, lift)
    })
})