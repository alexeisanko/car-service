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
    $('.modal').addClass('modal--visible');
});
$('.modal__close').click(function() {
    $('.modal').removeClass('modal--visible');
});
$(".header, .hero__links").on("click", "a", function (event) {
    event.preventDefault();
    let id = $(this).attr('href'),
        top = $(id).offset().top;
    $('body,html').animate({scrollTop: top}, 1000);
});