document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: '2023-02-07',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    dateClick: function(info) {
      alert('Отличный день для записи');
      // change the day's background color just for fun
      info.dayEl.style.backgroundColor = 'red';
    },

    });

  calendar.render();
});

$('.fc-day').click(function () {
  alert('Прекрасный день для записи')
})