
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
            if (data['error']) {
                alert(data['error'])
            } else if (data['next_page']){
                location.replace(data['next_page'])
            } else if (data['registration ok']) {
                $('.modal').removeClass('modal--visible')
                alert(data['registration ok'])
            }
        },
    })
    return false
})