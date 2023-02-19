$(document).on("submit", "form", function () {
    let $form = $(this);

    $.ajax({
        type: 'POST',
        url: '/api/check_status/',
        dataType: 'json',
        data: $form.serialize(),
        success: function (data) {
            alert(data['statuses'])
        },
    })
    return false
})


