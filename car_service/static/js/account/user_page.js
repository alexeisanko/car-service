$(document).ready(function () {
    $('.change-personal-data').click(function() {
        $('.modal__change-personal-data').addClass('modal--visible');
    });
    $('.info-cars__add').click(function() {
        $('.modal__add-car').addClass('modal--visible');
    });
    $('.modal__close').click(function() {
        $('.modal').removeClass('modal--visible');
    });
})
