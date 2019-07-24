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

    var apiKeyAccuweather = "RRYdh1nEGTRsquMFRwDpxZArhkoYDwXg";
    var apiKeyZomato = "4aeb449d2e6f84bc1b5c89347e2c463d";
    var userCity = "";

    //set welcome banner
    $("#welcome-banner").text("Welcome " + travelerName + "!");

    // Capture dropdown Button Click
    $(document).on("click", ".saved-trip", function(event) {
      event.preventDefault();
      var trippy = $(this).text();
      console.log(trippy);
      loadSavedTrip(trippy);


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

          weatherCall();
          restaurantCall();
      });
    }

    
    function weatherCall() {    
        userCity = $("#location-input").val();
        

        //AccuWeather API data
        var locationKey_queryURL = ("https://dataservice.accuweather.com/locations/v1/cities/search?apikey=" + apiKeyAccuweather + "&q=" + userCity);

        $("#location-input").val("");

        $.ajax({
            url: locationKey_queryURL,
            method: "GET"
            }).then(function(response) {

                var locationKey = response[0].Key;
                //var userCity = response[0].LocalizedName;
                //$("#userCity").html("<h2>" + userCity + "</h2>");

                var currentConditions_queryURL = ("https://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=" + apiKeyAccuweather);

                $.ajax({
                    url: currentConditions_queryURL,
                    method: "GET"
                    }).then(function(response) {
                        var temp = response[0].Temperature.Imperial.Value;
                        $("#currentTemp").html("<p>" + temp + " F</p>");
                        var condition = response[0].WeatherText;
                        $("#currentWeather").html("<p>" + condition + "</p>");
                        var icon = response[0].WeatherIcon;
                        //console.log(icon,icon.toString());
                        if (icon.toString().length < 2){
                            icon = ("0" + icon);
                        }
                        //console.log(icon);
                        $("#weatherIcon").attr("src","https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/" + icon + "-s.png");
                        $("#iconDiv").animate({opacity: 1.0}, 2000);
                    });
            });
        }

        function restaurantCall () {
        
            //Zomato API data
            var cityId_queryURL = ("https://developers.zomato.com/api/v2.1/cities?apikey=" + apiKeyZomato + "&q=" + userCity);

            $.ajax({
                url: cityId_queryURL,
                method: "GET"
                }).then(function(response) {
    
                    var cityId = response.location_suggestions[0].id;
                    var cityName = response.location_suggestions[0].name;
                    
                    $("#cityName").html("<p>" + cityName + "</p>");
    
                    var topThreeEats_queryURL = ("https://developers.zomato.com/api/v2.1/search?apikey=" + apiKeyZomato + "&entity_id=" + cityId + "&entity_type=city&count=3&radius=10000&sort=rating&order=desc");
    
                    $.ajax({
                        url: topThreeEats_queryURL,
                        method: "GET"
                        }).then(function(response) {
                            var option1 = response.restaurants[0].restaurant.name;
                            $("#zomato1").html("<p>" + option1 + "</p>");
    
                            var option2 = response.restaurants[1].restaurant.name;
                            $("#zomato2").html("<p>" + option2 + "</p>");
    
                            var option3 = response.restaurants[2].restaurant.name;
                            $("#zomato3").html("<p>" + option3 + "</p>");
                        }); 
                });
            }

});
