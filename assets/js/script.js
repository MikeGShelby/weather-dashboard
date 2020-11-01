var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-input");

var searchListEl = document.querySelector("#city-search-list");
var cityBtnEl = document.querySelector(".city-btn");

var overviewContainerEl = document.querySelector("#weather-overview");

var forecastSectionEl = document.querySelector(".forecast");
var forecastTitleEl = document.querySelector(".forecast-title");
var forecastContainerEl = document.querySelector("#forecast-cards");

// empty array to store all search inputs
var searchHistory = []

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();

    //if a city name is entered, run functions. Otherwise, prompt user to enter a city name
    if (city) {
        // run function to get city latitude and longitude data
        getCityCoords(city);
        cityInputEl.value = "";

        // run function to add city input to search list
        createSearchList(city);
    }
    else {
    alert("Please enter a city name");
    }
};

var buttonClickHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = event.target.getAttribute("data-city");
    console.log(city);

    // if a city name is entered, run functions. Otherwise, prompt user to enter a city name
    if (city) {
        // run function to get city latitude and longitude data
        getCityCoords(city);
        cityInputEl.value = "";

        // run function to add city input to search list
        createSearchList(city);
    }
    else {
    alert("Please enter a city name");
    }
};

var createSearchList = function(city) {
    // clear search list
    searchListEl.innerHTML = null;

    // add search input to start of search history list
    searchHistory.unshift(city);

    // create search history array with no duplicate values
    uniqueSearchHistory = Array.from(new Set(searchHistory));
    console.log(uniqueSearchHistory);

    for (i = 0; i < uniqueSearchHistory.length; i++) {

        // create list item elements
        listItemEl = document.createElement("li");

        // create button elements
        searchHistoryBtnEl = document.createElement("button");
        searchHistoryBtnEl.setAttribute("class", "btn city-btn");
        searchHistoryBtnEl.setAttribute("data-city", uniqueSearchHistory[i]);
        searchHistoryBtnEl.textContent = uniqueSearchHistory[i];
        listItemEl.appendChild(searchHistoryBtnEl);

        searchListEl.appendChild(listItemEl);
    }

    saveSearchList(uniqueSearchHistory);
}


var saveSearchList = function(uniqueSearchHistory) {
    localStorage.setItem("cities", JSON.stringify(uniqueSearchHistory));

    var storedCities = JSON.parse(localStorage.getItem("cities"));
    console.log(storedCities);
}

// var loadSearchList = function() {
//     var storedCities = JSON.parse(localStorage.getItem("cities"));

//     for (i = 0; 0 < storedCities.length; i++) {
//         createSearchList(storedCities[i]);
//     }
// }



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
    var uvIndex = data.daily[0].uvi;
    uvIndexEl = document.createElement("p");

    // evaluate and style uv index
    if (uvIndex <= 2) {
        uvIndexEl.innerHTML = "UV Index: <span class='uvi uvi-low'>" + uvIndex + "</span>";
    }
    else if (uvIndex > 2 && uvIndex <= 6) {
        uvIndexEl.innerHTML = "UV Index: <span class='uvi uvi-moderate'>" + uvIndex + "</span>";
    }
    else if (uvIndex > 6) {
        uvIndexEl.innerHTML = "UV Index: <span class='uvi uvi-high'>" + uvIndex + "</span>";
    }

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

        // Create date element for each forecast day
        var currentDate = new Date();
        var month = currentDate.getMonth()+1;
        var day = currentDate.getDate() + parseInt([i]);
        var year = currentDate.getFullYear();
        var fullDate = month + "/" + day + "/" + year;

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
}


searchFormEl.addEventListener("submit", formSubmitHandler);
searchListEl.addEventListener("click", buttonClickHandler);

// loadSearchList();
