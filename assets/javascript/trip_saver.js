  $(document).ready(function(){
  console.log("will anything log?");

  // Initialize Firebase
  var firebaseConfig = {
    apiKey: "AIzaSyAqNYooz-ezJydPPdGNfJR3Ye_bVzSUbjc",
    authDomain: "tuesday-ad59e.firebaseapp.com",
    databaseURL: "https://tuesday-ad59e.firebaseio.com",
    projectId: "tuesday-ad59e",
    storageBucket: "tuesday-ad59e.appspot.com",
    messagingSenderId: "316297117087",
    appId: "1:316297117087:web:07eb61fca7e1c814"
  };

  firebase.initializeApp(firebaseConfig);

  // Create a variable to reference the database.
  var database = firebase.database();

  // Initial Values
  var travelerName = "";
  var startDate = "";
  var endDate = "";
  var location = "";
  var tripName = "";

  // Capture Button Click
  $("#check-user").on("click", function(event) {
    event.preventDefault();

    var nomDeDB = firebase.database().ref(travelerName);
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

    //nomDeDB.orderByValue().equalTo(travelerName).once('value', function(snapshot){
      //var location = (snapshot.val().location) || 'Anonymous';
      //console.log(location);
      //console.log(snapshot.val());
    //});

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
            //travelerName: travelerName,
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

    // Console.loging the last user's data
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

});
