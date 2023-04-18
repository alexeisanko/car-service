$(document).ready(function () {
    let custom_services
    $.ajax({
                type: 'GET',
                url: '/api/get_custom_service/',
                dataType: 'json',
                success: function (data) {
                    custom_services = data
                    let first_custom_services = $('.services__icon').first().attr('id')
                    $('#title_service').text(custom_services[first_custom_services]['header'])
                    $('.services__desc').text(custom_services[first_custom_services]['description'])
                    $('.services__cost').text(`от ${custom_services[first_custom_services]['min_price']}p`)
                    $('.services__icon').first().css('background-color', '#4292B9')
                },
            })

    $('.owl-carousel-1').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            },
            1300: {
                items: 4
            }
        }
    });
    $('.owl-carousel-2').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        responsive: {
            0: {
                items: 1,
                slideBy: 1,
                mouseDrag: true,
                touchDrag: true
            },
            1000: {
                items: 2,
                slideBy: 2,
                mouseDrag: false,
                touchDrag: false
            }
        }
    });
    $('.header__media').click(function() {
        $(this).toggleClass('header__media--active');
        $('.menu__media').toggleClass('menu__media--active');
    });
    $('.header__auth').click(function() {
        $('.modal__login').addClass('modal--visible');
    });
    $('.modal__close').click(function() {
        $('.modal').removeClass('modal--visible');
    });
    $('.input-reg-link').click(function() {
        $('.modal__login').removeClass('modal--visible');
        $('.modal__registration').addClass('modal--visible');
    });
    $('.input-login-link').click(function() {
        $('.modal__registration').removeClass('modal--visible');
        $('.modal__login').addClass('modal--visible');
    });
    
    $('.services__icon').click(function (){
        let service_id = $(this).attr('id')
        $('#title_service').text(custom_services[service_id]['header'])
        $('.services__desc').text(custom_services[service_id]['description'])
        $('.services__cost').text(`от ${custom_services[service_id]['min_price']}p`)
        $('.services__icon').css('background-color', '#005484')
        $(this).css('background-color', '#4292B9')

    })
    $(".header__menu, .menu__media, .hero__links, .services__price").on("click", "a", function (event) {
        event.preventDefault();
        let id = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1000);
    });
})