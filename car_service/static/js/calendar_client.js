document.addEventListener('DOMContentLoaded', function () {
    $('#start-time').attr('value', "")
    $('#end-time').attr('value', "")
    let calendarEl = document.getElementById('calendar');
    GetRecordingCalendar(calendarEl)
});

$(document).ready(function () {

    let types_service = []
    for (let type_service of $("option")) {
        types_service.push(type_service.text)
    }

    // Изменение типа ремонтов
    $('#select-service').on('input', function () {
        if (types_service.includes($('#select-service').val())) {
            var calendarEl = document.getElementById('calendar');
            GetRecordingCalendar(calendarEl)
        }
    });

    // Изменение типа машин
    $('#checked-type-car').on('input', function () {
        let old_value = $('#select-type-car')
        if (old_value.text().trim() === 'Легковой') {
            old_value.text('Минифургон')
            $('#select-service').attr('list', 'service-minibus')
            $('#select-service').val('')
        } else {
            old_value.text('Легковой')
            $('#select-service').attr('list', 'service-car')
            $('#select-service').val('')
        }
    });

    $('#make-record').click(function (e) {
        e.preventDefault()
        let new_record = new InfoRecord()
        let is_checked = new_record.checkData()
        if (is_checked === true) {
                $.ajax({
                type: 'GET',
                url: '/api/make_recording/',
                dataType: 'json',
                data: new_record.data,
                success: function (data) {
                    $('.modal__message').addClass('modal--visible');
                    $('.text-message-modal').text('Поздравляем! \n Вы записались. В будущем мы вам будем отправлять письмо на почту со всей инфомрацией. Пока просто можно увидеть у странице администратора')

                },
            })

        }
    })

    class InfoRecord {
        constructor() {
            this.data = {
                service: $('#select-service').val(),
                name: $('#name').val(),
                phone: $('#phone').val(),
                email: $('#email').val(),
                model: $('#model').val(),
                number_car: $('#number').val(),
                comment: $('#comment').val(),
                start_time: $('#start-time').attr('value'),
                end_time: $('#end-time').attr('value'),
            }
        }

        checkData() {
            let field
            let message
            DeleteErrors(true)
            for (let key in this.data) {
                if (key === 'service' && !types_service.includes(this.data[key])) {
                    field = $('#select-service')
                    field.addClass('input--error')
                    message = field.next()
                    message.text(`Incorrest type service.\nPlease take correct type service from list`).addClass('span--error')
                    return false
                } else if (this.data[key] == false && key != 'comment') {
                    field = $(`#${key}`)
                    field.addClass('input--error')
                    message = field.next()
                    message.text(`Please fill in the field ${key}`).addClass('span--error')
                    return false
                } else if (key === 'phone' && this.data[key].length != 20) {
                    field = $('#phone')
                    field.addClass('input--error')
                    message = field.next()
                    message.text(`Your phone incorrect `).addClass('span--error')
                    return false
                } else if (key === 'email' && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($('#email').val())) {
                    field = $('#email')
                    field.addClass('input--error')
                    message = field.next()
                    message.text(`Your email incorrect `).addClass('span--error')
                    return false
                }
            }
            return true
        }
    }
})

function GetFreeTime(date, calendarEl, free_time) {

    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'listDay',
        initialDate: date,
        customButtons: {
            OpenCalendar: {
                text: 'calendar',
                click: function () {
                    $('#start-time').attr('value', "")
                    $('#end-time').attr('value', "")
                    GetRecordingCalendar(calendarEl)
                }
            }
        },
        headerToolbar: {
            left: 'title',
            center: '',
            right: 'OpenCalendar'
        },
        events: free_time,
        eventClick: function (info) {
            if (info.event.title === 'Свободно') {
                $('.fc-list-event').css('backgroundColor', 'white')
                info.el.style.backgroundColor = '#005484';
                // $('#start-time').attr('value', getLocalISOString(info.event.start))
                // $('#end-time').attr('value', getLocalISOString(info.event.end))
                $('#start-time').attr('value', info.event.start.toISOString())
                $('#end-time').attr('value', info.event.end.toISOString())
            }
        },
    });
    calendar.render();
}

function GetRecordingCalendar(calendarEl) {
    let start_recording = new Date()
    start_recording.setDate(start_recording.getDate() + 1)
    let finish_recording = new Date()
    finish_recording.setDate(finish_recording.getDate() + 60)
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        initialDate: start_recording.toISOString().slice(0, 10),
        headerToolbar: {
            left: 'today',
            center: 'title',
            right: 'prev,next'
        },
        events: [
            {
                start: start_recording.toISOString().slice(0, 10),
                end: finish_recording.toISOString().slice(0, 10),
                overlap: false,
                display: 'inverse-background',
            },
        ],
        eventColor: '#2c3e50',
        dateClick: function (info) {
            if (Date.parse(info.dateStr) >= Date.parse(start_recording.toISOString().slice(0, 10)) && Date.parse(info.dateStr) < Date.parse(finish_recording.toISOString().slice(0, 10))) {
                FreeTime(info.dateStr, calendarEl)
            }
        },
    });
    calendar.render();
}

function FreeTime(date, calendarEl) {
    let types_service = []
    for (let type_service of $("option")) {
        types_service.push(type_service.text)
    }
    let service = $('#select-service').val()
    if (types_service.includes($('#select-service').val())) {
        $.ajax({
            type: 'GET',
            url: '/api/get_free_place/',
            dataType: 'json',
            data: {
                'date': date,
                'type_service': service
            },
            success: function (data) {
                if (data['status'] === 'ok') {
                    GetFreeTime(date, calendarEl, data['free_places'])
                } else {
                    $('.modal__message').addClass('modal--visible');
                    $('.text-message-modal').text('Неполадки с серверов. Повторите попытку попозже')
                }
            },
        })
    } else {
        $('.modal__message').addClass('modal--visible');
        $('.text-message-modal').text('Для проверки свободного времени необходимо выбрать тип сервиса')
    }
}

function DeleteErrors(close_modal = false) {
    $(':input').removeClass('input--error')
    $('.error-message').text("").removeClass('span--error')
    $('.modal__dialog').removeClass('modal__dialog--error')
    if (close_modal) {
        $('.modal').removeClass('modal--visible')
    }
}

function getLocalISOString(date) {
  const offset = date.getTimezoneOffset()
  const offsetAbs = Math.abs(offset)
  const isoString = new Date(date.getTime() - offset * 60 * 1000).toISOString()
  return `${isoString.slice(0, -1)}${offset > 0 ? '-' : '+'}${String(Math.floor(offsetAbs / 60)).padStart(2, '0')}:${String(offsetAbs % 60).padStart(2, '0')}`
}