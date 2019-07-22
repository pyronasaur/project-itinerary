  $(document).ready(function(){
  console.log("will anything log?");

  firebase.initializeApp(firebaseConfig);

  // Create a variable to reference the database.
  var database = firebase.database();

  // fill dropdown with existing values
  initDropdown();

  // Initial Values
  var travelerName = sessionStorage.getItem("user");
  var startDate = "";
  var endDate = "";
  var location = "";
  var tripName = "";

  // Capture Button Click
  $("#check-user").on("click", function(event) {
    event.preventDefault();

    var nomDeDB = firebase.database().ref();
    var inputVal = $("#traveler-input").val().trim();
    console.log(inputVal);
    console.log(nomDeDB);

    if(nomDeDB.isEqual(inputVal))
    {
      console.log("they are equal");
    }
    else
    {
      console.log("they aren't equal");
    }

  });

    // Capture Button Click
    $("#add-trip").on("click", function(event) {
        event.preventDefault();

        // Grabbed values from text boxes
        travelerName = $("#traveler-input").val().trim();
        startDate = $("#start-input").val().trim();
        endDate = $("#end-input").val().trim();
        location = $("#location-input").val().trim();
        tripName = $("#trip-input").val().trim();

        console.log(travelerName);
        console.log(startDate);
        console.log(endDate);
        console.log(location);
        console.log(tripName);

        // Code for handling the push
        database.ref(travelerName+"/"+tripName).set({
            startDate: startDate,
            endDate: endDate,
            location: location
            });
        });

  // Firebase watcher .on("child_added"
  database.ref(travelerName).on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();
    console.log(sv);

    // Console.logging the last user's data
    console.log(sv.travelerName);
    console.log(sv.startDate);
    console.log(sv.endDate);
    console.log(sv.location);
    console.log(sv.tripName);

    // Change the HTML to reflect
    $("#traveler-display").text(sv.travelerName);
    $("#start-display").text(sv.startDate);
    $("#end-display").text(sv.endDate);
    $("#location-display").text(sv.location);
    $("#trip-display").text(sv.tripName);

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  //function to populate dropdown on page load
  //TODO: add API call to button selection
  function initDropdown()
  {
    var user = sessionStorage.getItem("newUser");
    if(user)
    {
      database.ref().orderByChild(user).once('value')
        .then(function(snapshot)
        {                
            console.log(snapshot.val());
            snapshot.forEach(function(childSnapshot)
            {
              var existingTrip = $("<button>");
              existingTrip.html(childSnapshot.key);
              existingTrip.addClass("dropdown-item");
              existingTrip.addClass(childSnapshot.key);
              existingTrip.addType("button");
              $("#dropdownMenuButton").append(existingTrip);
            })
        })
    }
  }

});
