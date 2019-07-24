$( document ).ready(function() { 

    var apiKeyAccuweather = "RRYdh1nEGTRsquMFRwDpxZArhkoYDwXg";
    var apiKeyZomato = "4aeb449d2e6f84bc1b5c89347e2c463d";
    var userCity = "";




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
                            var option0Name = response.restaurants[0].restaurant.name;
                            var option0Address = response.restaurants[0].restaurant.location.address;
                            var option0Cost = response.restaurants[0].restaurant.average_cost_for_two;
                            var option0URL = response.restaurants[0].restaurant.menu_url;
                            $("#zomato1").html("<div class='restaurant'><h5>" + option0Name + "</h5><p><i>" + option0Address + "</i></p><p>Cost for 2 people: <b>$" + option0Cost + "</b></p><p><a href='" + option0URL + "' target='_blank'>menu link</a></p>");

                            var option1Name = response.restaurants[1].restaurant.name;
                            var option1Address = response.restaurants[1].restaurant.location.address;
                            var option1Cost = response.restaurants[1].restaurant.average_cost_for_two;
                            var option1URL = response.restaurants[1].restaurant.menu_url;
                            $("#zomato2").html("<div class='restaurant'><h5>" + option1Name + "</h5><p><i>" + option1Address + "</i></p><p>Cost for 2 people: <b>$" + option1Cost + "</b></p><p><a href='" + option1URL + "' target='_blank'>menu link</a></p>");

                            var option2Name = response.restaurants[2].restaurant.name;
                            var option2Address = response.restaurants[2].restaurant.location.address;
                            var option2Cost = response.restaurants[2].restaurant.average_cost_for_two;
                            var option2URL = response.restaurants[2].restaurant.menu_url;
                            $("#zomato3").html("<div class='restaurant'><h5>" + option2Name + "</h5><p><i>" + option2Address + "</i></p><p>Cost for 2 people: <b>$" + option2Cost + "</b></p><p><a href='" + option2URL + "' target='_blank'>menu link</a></p>");
                            

                        }); 
                });
            }


    $("#submit-btn").on("click", function(event) {
        event.preventDefault();
        weatherCall();
        restaurantCall();
    });

});

// ***Test if jQuery is loading properly***
window.onload = function() {
    if (window.jQuery) {
        console.log('jQuery is loaded');
    } 
}