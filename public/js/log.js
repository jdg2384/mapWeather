$( document ).ready(function() {
    // Submit click event
    $( "#submit" ).on( "click", function() {
        event.preventDefault();
        const email = $( "#email" ).val()
        const password = $( "#password" ).val()
        // Log in object
        let obj = {
            email: email,
            password: password
        }
        //Ajax post 
        $.ajax({
            url: `/login`,
            type: 'POST',
            data: obj,
            success: function (data) {
               window.location.href = '/map.html'
               console.log("success")
            }
        })
    })
});