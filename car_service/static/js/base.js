$(document).ready(function () {
    let phones = document.querySelectorAll('.mask-number-phone')
        for (let phone of phones) {
            let mask_phone = IMask(phone, {mask: '+{358} (000) 000-00-00'})
        }

    let numbers = document.querySelectorAll('.mask-number-car')
        for (let number of numbers) {
            let mask_number = IMask(number, {mask: 'aa[a]-0[00]'})
        }

    $('.mask-number-car').on('input', function (){
        // $('#number').val($('#number').val().toUpperCase())
        $(this).val($(this).val().toUpperCase())
    })
})