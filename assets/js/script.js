var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
var prevSearchEl = document.querySelector("#prev-search");
var searchedCityButtonEl= document.querySelector("#searched-city");
var cityWeatherEl = document.querySelector("#weather-today");
var city5DEl = document.querySelector("#forecast5");
var prevSearches = [];

var formSubmitHandler = function(event){
    // prevent page from refreshing
    event.preventDefault();

    //get value from input element
    var cityName= cityInputEl.value.trim();

    if(cityName){
        getLatLon(cityName);
        createPrevButtons(cityName);
    }
    else{
        alert("Please enter a city");
    }
};

var savedSubmitHandler = function(city){
  var cityName= city.textContent;
  if(cityName){
    //format openWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=imperial&appid=4cbd25328987295e23b007fb7a00499b";

    //make a get request to url
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            getTodaysWeather(data, cityName);
            get5DWeather(cityName);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        alert("Unable to connect to OpenWeather");
      });
  }
};

var getLatLon = function(city){
    //format openWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=4cbd25328987295e23b007fb7a00499b";

    //make a get request to url
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            getTodaysWeather(data, city);
            get5DWeather(city);
            prevSearches.push(city);
            saveSearches();
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        alert("Unable to connect to OpenWeather");
      });
};

var getTodaysWeather = function(weather, location){
    var lat= weather.coord.lat;
    var lon= weather.coord.lon;
    var apiUrl2="https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,daily,alerts&units=imperial&appid=4cbd25328987295e23b007fb7a00499b";
    //make a get request to url
    fetch(apiUrl2)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(data) {
            displayTodaysWeather(data, location);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        alert("Unable to connect to OpenWeather");
      });
};

var displayTodaysWeather = function(weather, location){
    //check if api returned info
    if(weather.length === 0){
        cityWeatherEl.textContent = "No data found.";
    }

    //initialize variables where info will be shared
    var cityEl = document.createElement("h1");
    var timeEl = moment.unix(weather.current.dt).format("MM/DD/YYYY");
    var tempEl = document.createElement("h3");
    var windEl = document.createElement("h3");
    var humidEl = document.createElement("h3");
    var uvEl = document.createElement("h3");
    var iconEl = document.createElement("img");

    iconEl.setAttribute("src","https://openweathermap.org/img/wn/"+weather.current.weather[0].icon+".png");

    //set the text of the weather elements
    cityEl.textContent = location + " " + timeEl;
    cityEl.appendChild(iconEl);
    tempEl.textContent ="Temp: "+weather.current.temp+ "°F";
    windEl.textContent ="Wind: "+weather.current.wind_speed+ " MPH";
    humidEl.textContent ="Humidity: "+weather.current.humidity + "%";
    uvEl.textContent ="UV Index: "+ weather.current.uvi;

    cityWeatherEl.innerHTML= "";
    cityWeatherEl.classList= "city-weather";

    cityWeatherEl.appendChild(cityEl);
    cityWeatherEl.appendChild(tempEl);
    cityWeatherEl.appendChild(windEl);
    cityWeatherEl.appendChild(humidEl);
    cityWeatherEl.appendChild(uvEl);
};

var get5DWeather = function(city){
        //format openWeather api url
        var apiUrl3 = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=imperial&appid=4cbd25328987295e23b007fb7a00499b";

        //make a get request to url
        fetch(apiUrl3)
        .then(function(response) {
            // request was successful
            if (response.ok) {
              response.json().then(function(data) {
                  display5DWeather(data);
              });
            } else {
              alert("Error: " + response.statusText);
            }
          })
          .catch(function(error) {
            alert("Unable to connect to OpenWeather");
          });
};

var display5DWeather = function(weather){
    //check if api returned info
    if(weather.length === 0){
        city5DEl.textContent = "No data found.";
    }
    
    city5DEl.innerHTML = "";
    
    for(var i = 0; i<=5; i++){
        var date= document.createElement("p");
        var temp= document.createElement("p");
        var wind= document.createElement("p");
        var humidity= document.createElement("p");
        var iconEl = document.createElement("img");
        iconEl.setAttribute("src","https://openweathermap.org/img/wn/"+weather.list[i].weather[0].icon+".png");

        date.textContent = moment.unix(weather.list[i].dt).format("MM/DD/YYYY");
        date.appendChild(iconEl);
        temp.textContent = "Temp: "+ weather.list[i].main.temp + "°F";
        wind.textContent = "Wind: "+ weather.list[i].wind.speed + " MPH";
        humidity.textContent = "Humidity: "+ weather.list[i].main.humidity + "%";

        var day5El= document.createElement("div");
        day5El.classList = "col-sm-2";
        day5El.appendChild(date);
        day5El.appendChild(temp);
        day5El.appendChild(wind);
        day5El.appendChild(humidity);

        city5DEl.appendChild(day5El);
    }
};

var createPrevButtons= function(city){
    var button= document.createElement("button");
    button.textContent = city;
    button.classList= "btn saved-btn";
    button.setAttribute("onclick", "savedSubmitHandler("+button.textContent+")");
    button.setAttribute("id", city);
    prevSearchEl.appendChild(button);
};
function saveSearches(){
    localStorage.setItem("previous-searches", JSON.stringify(prevSearches));
}
function loadSearches(){
    var savedSearches = localStorage.getItem("previous-searches");
    if(!savedSearches){
        prevSearches = [];
        return false;
    }
    prevSearches = JSON.parse(savedSearches);
    for(var i = 0; i<prevSearches.length;i++){
        createPrevButtons(prevSearches[i]);
    }
}
loadSearches();
userFormEl.addEventListener("submit", formSubmitHandler);