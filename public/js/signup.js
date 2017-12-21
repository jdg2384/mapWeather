$( document ).ready(function() {
    // Submit click event
    $( "#submit" ).on( "click", function() {
        event.preventDefault();
        const first = $( "#name" ).val();
        const last = $( "#nameLast" ).val()
        const email = $( "#email" ).val()
        const password = $( "#password" ).val()
        // Sign up info object
        let obj = {
            first: first,
            last: last,
            email: email,
            password: password
        }
        //Ajax post 
        $.ajax({
            url: `/signup`,
            type: 'POST',
            data: obj,
            success: function (data) {
                window.location.href = '/log.html'
            }
        })
    })
});
