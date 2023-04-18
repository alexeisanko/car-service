
$('#status-scroll').on("submit", "form", function () {
    // let $form = $(this);
   let number = $('.status__number').val()
    $.ajax({
        type: 'GET',
        url: '/api/check_status/',
        dataType: 'json',
        data: {'registration_number': number},
        // data: $form.serialize(),
        success: function (data) {
            alert(data['statuses'])
        },
    })
    return false
})

$('.modal').on("submit", "form", function () {
    let $form = $(this);
    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        dataType: 'json',
        data: $form.serialize(),
        success: function (data) {
            location.replace(data['next_page'])
        },
    })
    return false
})