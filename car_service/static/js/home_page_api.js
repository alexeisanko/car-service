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

$('.modal').on("submit", "form", function (e) {
    DeleteErrors()
    let $form = $(this);
    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        dataType: 'json',
        data: $form.serialize(),
        success: function (data) {
            if (data['errors']) {
                let field
                let message
                for (let error in data['errors']) {
                    console.log(data['errors'][error]['error_field'])
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
                PassedEvent(data['passed'])
            }
        },
    })
    return false
})

function DeleteErrors(close_modal = false) {
    $(':input').removeClass('input--error')
    $('.error-message').text("").removeClass('span--error')
    $('.modal__dialog').removeClass('modal__dialog--error')
    if (close_modal) {
        $('.modal').removeClass('modal--visible')
    }
}

function PassedEvent(event) {
    if (event === 'registrations') {
        $('.modal__message').addClass('modal--visible');
        $('.text-message-modal').text('Для завершения регистрации перейдите на веденную почту и подтвердите данные')
    }

}