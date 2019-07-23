  $(document).ready(function(){

    //initialize and create a db reference variable.
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();

    // fill dropdown with existing values
    initDropdown();
    
    // Initial Values
    var travelerName = sessionStorage.getItem("user");
    var startDate = "";
    var endDate = "";
    var location = "";
    var tripName = "";

    //set welcome banner
    $("#welcome-banner").text("Welcome " + travelerName + "!");

    // Capture dropdown Button Click
    $(document).on("click", ".saved-trip", function(event) {
      event.preventDefault();
      var trippy = $(this).text();
      console.log(trippy);
      loadSavedTrip(trippy);
      weatherCall();
      restaurantCall();

    });

    // Capture submit Button Click and save entries to db
    $("#submit-btn").on("click", function(event) {
        event.preventDefault();

        // Grabbed values from text boxes
        startDate = $("#departure-input").val().trim();
        endDate = $("#return-input").val().trim();
        location = $("#location-input").val().trim();
        tripName = $("#tripName-input").val().trim();

        console.log(travelerName);
        console.log(startDate);
        console.log(endDate);
        console.log(location);
        console.log(tripName);

        // Code for handling the db data insert
        database.ref(travelerName+"/"+tripName).set({
            startDate: startDate,
            endDate: endDate,
            location: location
          });

        //add a button for the new trip to the dropdown menu
        var existingTrip = $("<button>");
        existingTrip.html(tripName);
        existingTrip.addClass("dropdown-item saved-trip");
        existingTrip.addClass(location);
        existingTrip.attr("type", "button");
        $("#dropdownMenu").append(existingTrip);
            
    });

    //function to populate dropdown on page load
    function initDropdown()
    {
      var user = sessionStorage.getItem("newUser");
      var travelerName = sessionStorage.getItem("user");
      if(user)
      {
        database.ref(travelerName).orderByValue().once('value')
          .then(function(snapshot)
          {                
              console.log(snapshot.val());
              snapshot.forEach(function(childSnapshot)
              {
                var existingTrip = $("<button>");
                existingTrip.html(childSnapshot.key);
                existingTrip.addClass("dropdown-item saved-trip");
                existingTrip.addClass(childSnapshot.val().location);
                existingTrip.attr("type", "button");
                $("#dropdownMenu").append(existingTrip);
              })
          })
      }
    }

    //load saved trip values for selected dropdown item into input fields
    //TODO: add API call to button selection
    function loadSavedTrip(tripName)
    {
      database.ref(travelerName + "/" + tripName).orderByValue().once('value')
        .then(function(snapshot)
        {
          var data = snapshot.val();                        
          console.log(data);

          $("#location-input").val(data.location);
          $("#departure-input").val(data.startDate);
          $("#return-input").val(data.endDate);          
          $("#tripName-input").val(tripName);
      });
    }

});
