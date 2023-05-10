$(document).ready(function () {
    $('.modal, .status').on("submit", "form", function () {
        DeleteErrors()
        let $form = $(this);
        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            dataType: 'json',
            data: $form.serialize(),
            success: function (data) {
                if (data['errors']) {
                    let field
                    let message
                    for (let error in data['errors']) {
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
                    MessageEvent(data['passed'])
                }
            },
            error: function () {
                MessageEvent({'msg': 'Ошибка сервера. Попробуйте попозже'})
            }
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

    function MessageEvent(event) {
        $('.modal__message').addClass('modal--visible');
        $('.text-message-modal').text(event['msg'])
    }




})