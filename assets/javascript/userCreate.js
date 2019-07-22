$(document).ready(function(){

    $('.alert').hide();

    //Initialize DB
    firebase.initializeApp(firebaseConfig);
    
    //Global vars
    var database = firebase.database();
    var doesExist;
    var user;
    
    $("#button-create-user").on("click", function(){
        user = $("#name-entry").val().trim();
        //var doesExist = checkForUser(user);
        console.log(doesExist);

        if(checkForUser(user))
        {       
            console.log("user exists already");
            $("#login-message").text("Sorry, that user exists already.  Please press login or change login name.");
            if($('alert').css('opacity') == 0)
            {
                $('.alert').fadeIn("slow");
            }
            else
            {
                $('.alert').fadeOut("slow");
                $('.alert').fadeIn("slow");
            }
        }
        else
        {
            console.log("user not found");
            sessionStorage.clear();
            sessionStorage.setItem("user", user);
            sessionStorage.setItem("newUser", true);

            //window.location.href = "main.html";
        } 
        
    })

    $("#button-login").on("click", function(){

        user = $("#name-entry").val().trim();
        
        if(checkForUser(user))
        {
            console.log("user found");
            sessionStorage.clear();
            sessionStorage.setItem("user", user);
            sessionStorage.setItem("newUser", false);

            //window.location.href = "main.html";
        }
        else
        {
            console.log("user " + user + " does not exist");
            $("#login-message").text("Sorry, that user does not exist.  Please create new user or change login name.");
            if($('alert').css('opacity') == 0)
            {
                $('.alert').fadeIn("slow");
            }
            else
            {
                $('.alert').fadeOut("slow");
                $('.alert').fadeIn("slow");
            }
        }
    })

    function checkForUser(username)
    {
        let exists = false;
        database.ref().orderByKey().once('value')
            .then(function(snapshot)
            {
                console.log(snapshot.val());
                snapshot.forEach(function(childSnapshot)
                {
                    if(childSnapshot.key.toLowerCase() === username.toLowerCase())
                    {
                        console.log("found it");
                        console.log(childSnapshot.key);
                        return exists = true;
                    }
                    console.log(exists);
                })
                console.log(exists);
                return exists;
            })
            console.log(exists);
        return exists;
    }

    $('.close').on("click", function(event) {
        $('.alert').fadeOut('slow');
        //$('.alert').hide();
    });

});