var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");

var overviewContainerEl = document.querySelector("#weather-overview");
var forecastContainerEl = document.querySelector("#forecast-cards");
var forecastSectionEl = document.querySelector(".forecast");
var forecastTitleEl = document.querySelector(".forecast-title");

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
    // format the OpenWeather api url for city name
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=f1861af816f9e98e7d029ccebf696d61";

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {

        var cityLat = data.coord.lat;
        var cityLon = data.coord.lon;

        getCityData(cityLat, cityLon, city);
        });
    });
}

var getCityData = function(cityLat, cityLon, city) {
    // format the OpenWeather api url for lat & lon
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&appid=f1861af816f9e98e7d029ccebf696d61";

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
        console.log(data);
        console.log("Temperature: " + data.daily[0].temp.day + " °F");
        console.log("Humidity: " + data.daily[0].humidity + "%");
        console.log("Wind Speed: " + data.daily[0].wind_speed + " MPH");
        console.log("UV Index: " + data.daily[0].uvi);

        displayOverview(data, city);
        });
    });
}


var displayOverview = function(data, city) {
    // clear old content
    overviewContainerEl.innerHTML = null;

    // Create and append a title element
    overviewTitleEl = document.createElement("h2");
    overviewTitleEl.setAttribute("class", "overview-title");
    overviewTitleEl.textContent = city;
    overviewContainerEl.appendChild(overviewTitleEl);

    // Create and append current date
    var currentDate = new Date();
    var month = currentDate.getMonth()+1;
    var day = currentDate.getDate();
    var year = currentDate.getFullYear();
    var fullDate0 = month + "/" + day + "/" + year;

    dateEl = document.createElement("span");
    dateEl.textContent = " (" + fullDate0 + ") ";
    overviewTitleEl.appendChild(dateEl);

    // Create and append an icon image
    var iconID = data.daily[0].weather[0].icon;
    overviewTitleIconEl = document.createElement("img");
    overviewTitleIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + iconID + "@2x.png");
    overviewTitleIconEl.setAttribute("class", "overview-icon");
    overviewTitleEl.appendChild(overviewTitleIconEl);


    // Create and append a p element for temperature
    var temperature = "Temperature: " + data.daily[0].temp.day + " °F";
    temperatureEl = document.createElement("p");
    temperatureEl.innerText = temperature;
    overviewContainerEl.appendChild(temperatureEl);

    // Create and append a p element for humidity
    var humidity = "Humidity: " + data.daily[0].humidity + "%";
    humidityEl = document.createElement("p");
    humidityEl.innerText = humidity;
    overviewContainerEl.appendChild(humidityEl);

    // Create and append a p element for wind speed
    var windSpeed = "Wind Speed: " + data.daily[0].wind_speed + " MPH";
    windSpeedEl = document.createElement("p");
    windSpeedEl.innerText = windSpeed;
    overviewContainerEl.appendChild(windSpeedEl);

    // Create and append a p element for UV Index
    var uvIndex = "UV Index: " + data.daily[0].uvi;
    uvIndexEl = document.createElement("p");
    uvIndexEl.innerText = uvIndex;
    overviewContainerEl.appendChild(uvIndexEl);

    displayForecast(data);

}

var displayForecast = function(data) {
    // clear old content
    forecastContainerEl.innerHTML = null;

    // add forecast section title
    forecastTitleEl.textContent = "5-Day Forecast";


    // Create and display forecast cards for each of the five forecast days
    for (var i = 1; i < 6; i++) {

        // Create forecast card div element
        var forecastCardEl = document.createElement("div");
        forecastCardEl.setAttribute("class", "forecast-card");

        // Create data element for each forecast day
        var currentDate = new Date();
        console.log(currentDate);
        var month = currentDate.getMonth()+1;
        var day = currentDate.getDate() + parseInt([i]);
        console.log(day);
        var year = currentDate.getFullYear();
        var fullDate = month + "/" + day + "/" + year;
        console.log(fullDate);

        dateEl = document.createElement("h4");
        dateEl.textContent = fullDate;

        forecastCardEl.appendChild(dateEl);

        // Create and append an icon image
        var iconID = data.daily[i].weather[0].icon;
        forecastIconEl = document.createElement("img");
        forecastIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + iconID + "@2x.png");
        forecastIconEl.setAttribute("class", "forecast-icon");
        forecastCardEl.appendChild(forecastIconEl);

        // Create and append a p element for temperature
        var temperature = "Temp: " + data.daily[i].temp.day + " °F";
        temperatureEl = document.createElement("p");
        temperatureEl.innerText = temperature;
        forecastCardEl.appendChild(temperatureEl);

        // Create and append a p element for humidity
        var humidity = "Humidity: " + data.daily[i].humidity + "%";
        humidityEl = document.createElement("p");
        humidityEl.innerText = humidity;
        forecastCardEl.appendChild(humidityEl);




        forecastContainerEl.appendChild(forecastCardEl);

    }












    // // Create and append a p element for wind speed
    // var windSpeed = "Wind Speed: " + data.daily[0].wind_speed + " MPH";
    // windSpeedEl = document.createElement("p");
    // windSpeedEl.innerText = windSpeed;
    // overviewContainerEl.appendChild(windSpeedEl);

    // // Create and append a p element for UV Index
    // var uvIndex = "UV Index: " + data.daily[0].uvi;
    // uvIndexEl = document.createElement("p");
    // uvIndexEl.innerText = uvIndex;
    // overviewContainerEl.appendChild(uvIndexEl);

}



searchFormEl.addEventListener("submit", formSubmitHandler);

// https://api.openweathermap.org/data/2.5/weather?q=seattle&appid=f1861af816f9e98e7d029ccebf696d61

// https://api.openweathermap.org/data/2.5/onecall?lat=47.61&lon=-122.33&appid=f1861af816f9e98e7d029ccebf696d61