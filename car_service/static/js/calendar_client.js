document.addEventListener('DOMContentLoaded', function () {
    $('#start-time').attr('value', "")
    $('#end-time').attr('value', "")
    let calendarEl = document.getElementById('calendar');
    GetRecordingCalendar(calendarEl)
});

$(document).ready(function () {
    let phoneMask = IMask(
        document.getElementById('phone'), {
            mask: '+{358} (000) 000-00-00',

        });
    let phoneregisterMask = IMask(
        document.getElementById('register-phone'), {
            mask: '+{358} (000) 000-00-00',

        });

    let numberCarMask = IMask(
        document.getElementById('number'), {
            mask: 'aa[a]-0[00]',

        })

    let addnumberCarMask = IMask(
        document.getElementById('add-number-car'), {
            mask: 'aa[a]-0[00]',

        })
    class InfoRecord {
        constructor() {
            this.data = {
                service: $('#select-service').val(),
                name: $('#name').val(),
                phone: phoneMask.unmaskedValue,
                email: $('#email').val(),
                model: $('#model').val(),
                number_car: $('#number').val(),
                comment: $('#comment').val(),
                start_time: $('#start-time').attr('value'),
                end_time: $('#end-time').attr('value')
            }
        }

        checkData() {
            for (let key in this.data) {
                if (key === 'service' && !types_service.includes(this.data[key])) {
                    return [false, `Incorrest type service.\nPlease take correct type service from list`]
                } else if (this.data[key] == false && key != 'comment') {
                    return [false, `Please fill in the field ${key}`]
                } else if (key === 'phone' && this.data[key].length != 13) {
                    return [false, `Your phone incorrect `]
                } else if (key === 'email' && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($('#email').val())) {
                    return [false, `Your email incorrect `]
                }
            }
            return [true, 'Test Passed']
        }
    }

    let types_service = []
    for (let type_service of $("option")) {
        types_service.push(type_service.text)
    }

    $('#make-record').click(function (e) {
        console.log(phoneMask.unmaskedValue)
        e.preventDefault()
        let new_record = new InfoRecord()
        let is_checked = new_record.checkData()
        if (is_checked[0] === false) {
            alert(is_checked[1])
        } else {
            $.ajax({
                type: 'GET',
                url: '/api/make_recording/',
                dataType: 'json',
                data: new_record.data,
                success: function (data) {
                    alert('Поздравляем! \n Вы записались. В будущем мы вам будем отправлять письмо на почту со всей инфомрацией. Пока просто можн оувидеть у странице администратора')
                    location.reload()
                },
            })

        }
    })

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

    $('#number').on('input', function (){
        $('#number').val($('#number').val().toUpperCase())
    })
    $('#add-number-car').on('input', function (){
        $('#add-number-car').val($('#add-number-car').val().toUpperCase())
    })
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
                    alert('Внутренняя ошибка, запись пока недоступна')
                }
            },
        })
    } else {
        alert(`Incorrest type service.\nPlease take correct type service from list`)
    }
}
