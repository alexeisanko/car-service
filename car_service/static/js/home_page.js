$('.owl-carousel-1').owlCarousel({
    loop: true,
    margin: 20,
    nav: true,
    dots: true,
    responsive: {
        0: {
            items: 1
        },
        700: {
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
})