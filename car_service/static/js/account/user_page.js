$(document).ready(function () {
    $('.change-personal-data').click(function() {
        $('.modal__change-personal-data').addClass('modal--visible');
    });
    $('.info-cars__add').click(function() {
        $('.modal__add-car').addClass('modal--visible');
    });
    $('.change-car-info').click(function() {
        $('.modal__change-car-info').addClass('modal--visible');
        let car_id = $(this).data('carId')
        $('.get-car-id').val(car_id)
    });

    $('.delete-car').click(function (){
        $.ajax({
            type: 'GET',
            url: '/api/delete-car/',
            dataType: 'json',
            data: {"car_id": $(this).data('carId')},
            success: function (data) {
                location.reload()
            },
        })
    })
    $('.modal__close').click(function() {
        DeleteErrors(true)
    });
})


function DeleteErrors(close_modal = false) {
    $(':input').removeClass('input--error')
    $('.error-message').text("").removeClass('span--error')
    $('.modal__dialog').removeClass('modal__dialog--error')
    if (close_modal) {
        $('.modal').removeClass('modal--visible')
    }
}


