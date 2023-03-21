document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  GetRecordingCalendar(calendarEl)

});

function GetFreeTime (date, calendarEl) {
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

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'listDay',
    initialDate: date,
    customButtons: {
      OpenCalendar: {
        text: 'calendar',
        click: function() {
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
      if (info.event.title == 'Свободно') {
        console.log(info)
        info.el.style.backgroundColor = 'blue';
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
        display: 'inverse-background'
      },
    ],
    eventColor: '#041506',
    dateClick: function(info) {
      if (Date.parse(info.dateStr) >= Date.parse(start_recording.toISOString().slice(0, 10)) && Date.parse(info.dateStr) < Date.parse(finish_recording.toISOString().slice(0, 10))) {
        GetFreeTime(info.dateStr, calendarEl)
      }
    },
    });
  calendar.render();
}
