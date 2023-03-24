document.addEventListener('DOMContentLoaded', function() {
    $('#start-time').attr('value', "")
    $('#end-time').attr('value', "")
    let calendarEl = document.getElementById('calendar');
    GetRecordingCalendar(calendarEl)
});

function GetFreeTime (date, calendarEl) {
  // Запрос для получения свободных мест
    FreeTime(date)
    let free_time = []
    let begin_work_time =  new Date(date)
    begin_work_time.setHours(11)
    let end_work_time = new Date(begin_work_time)
    end_work_time.setMinutes(end_work_time.getMinutes() + 30)

  for (let i=0; i<18; i++) {
    free_time.push({
      title: 'Свободно',
      start: begin_work_time.toISOString().slice(0, 19),
      end: end_work_time.toISOString().slice(0, 19),
    })
    begin_work_time.setMinutes(begin_work_time.getMinutes() + 30)
    end_work_time.setMinutes(end_work_time.getMinutes() + 30)
  }

  let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'listDay',
    initialDate: date,
    customButtons: {
      OpenCalendar: {
        text: 'calendar',
        click: function() {
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
    eventClick: function(info) {
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

function GetRecordingCalendar (calendarEl) {
  let start_recording = new Date()
  start_recording.setDate(start_recording.getDate() + 1)
  let finish_recording = new Date()
  finish_recording.setDate(finish_recording.getDate() + 60)
  var calendar = new FullCalendar.Calendar(calendarEl, {
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
    dateClick: function(info) {
      if (Date.parse(info.dateStr) >= Date.parse(start_recording.toISOString().slice(0, 10)) && Date.parse(info.dateStr) < Date.parse(finish_recording.toISOString().slice(0, 10))) {
        GetFreeTime(info.dateStr, calendarEl)
      }
    },
    });
  calendar.render();
}

$(document).ready(function() {
    class InfoRecord  {
          constructor() {
            this.data = {
              service: $('#select-service').val(),
              name: $('#name').val(),
              phone: $('#phone').val(),
              email: $('#email').val(),
              model: $('#model').val(),
              comment: $('#comment').val(),
              start_time: $('#start-time').attr('value'),
              end_time: $('#end-time').attr('value')
            }}

          checkData() {
            for (let key in this.data) {
                if (key === 'service' && !types_service.includes(this.data[key])) {
                    return [false, `Incorrest type service.\nPlease take correct type service from list`]
                } else if  (this.data[key] == false && key != 'comment') {
                    return [false, `Please fill in the field ${key}`]
                }
            }
                return [true, 'Test Passed']
            }
        }
    let types_service = []
    for (let type_service of $("option")) {
                types_service.push(type_service.text)
            }

    $('#make-record').click(function (e){
        e.preventDefault()
        let new_record = new InfoRecord()
        let is_checked = new_record.checkData()
        if (is_checked[0] === false) {
            alert(is_checked[1])
        } else {
            alert('Поздравляем! \n Вы записались, все подробности с напоминанием мы Вам отправили на почту')
        }
    })

    // Изменение типа ремонтов
    $('#select-service').on('input', function () {
            if (types_service.includes($('#select-service').val())) {
                var calendarEl = document.getElementById('calendar');
                GetRecordingCalendar(calendarEl)
            }
        });
})

function FreeTime(date) {
    let service = $('#select-service').val()

    $.ajax({
        type: 'GET',
        url: '/api/get_free_times/',
        dataType: 'json',
        data: {
            'date': date,
            'type_service': service
        },
        success: function (data) {
            alert(data['statuses'])
        },
    })
}
