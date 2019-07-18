$( document ).ready(function() {

    var apiKeyAccuweather = "RRYdh1nEGTRsquMFRwDpxZArhkoYDwXg";
    var apiKeyZomato = "4aeb449d2e6f84bc1b5c89347e2c463d";



    $("#submit-btn").on("click", function() {
        //event.preventDefault();
        var userCity = $("#userLocation").val();
        

        //AccuWeather API data
        var locationKey_queryURL = ("http://dataservice.accuweather.com/locations/v1/cities/search?apikey=" + apiKeyAccuweather + "&q=" + userCity);
        
        //Zomato API data
        var cityId_queryURL = ("https://developers.zomato.com/api/v2.1/cities?apikey=" + apiKeyZomato + "&q=" + userCity);

        $("#userLocation").val("");

        $.ajax({
            url: locationKey_queryURL,
            method: "GET"
            }).then(function(response) {

                var locationKey = response[0].Key;
                //var userCity = response[0].LocalizedName;
                //$("#userCity").html("<h2>" + userCity + "</h2>");

                var currentConditions_queryURL = ("http://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=" + apiKeyAccuweather);

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
                        $("#iconDiv").animate({right: '10px',opacity: '1.0'},2000);
                    });
            });

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
        });

});

// ***Test if jQuery is loading properly***
window.onload = function() {
    if (window.jQuery) {
        console.log('jQuery is loaded');
    }
}