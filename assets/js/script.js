var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();
    console.log(city);

    if (city) {
    getCityCoords(city);
    cityInputEl.value = "";
    }
    else {
    alert("Please enter a city name");
    }
};


var getCityCoords = function(city) {
    // format the OpenWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=f1861af816f9e98e7d029ccebf696d61";

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
        console.log(data);

        var cityLat = data.coord.lat;
        var cityLon = data.coord.lon;

        console.log(cityLat);
        console.log(cityLon);

        getCityData(cityLat, cityLon);
        });
    });
}

var getCityData = function(cityLat, cityLon) {
    // format the OpenWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&appid=f1861af816f9e98e7d029ccebf696d61";

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
        console.log(data);
        console.log(data.daily[0].temp.day);
        });
    });
}


searchFormEl.addEventListener("submit", formSubmitHandler);

// https://api.openweathermap.org/data/2.5/weather?q=seattle&appid=f1861af816f9e98e7d029ccebf696d61

// https://api.openweathermap.org/data/2.5/onecall?lat=47.61&lon=-122.33&appid=f1861af816f9e98e7d029ccebf696d61