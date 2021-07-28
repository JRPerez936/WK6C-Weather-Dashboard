var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
var prevSearchEl = document.querySelector("#prev-search");
var cityWeatherEl = document.querySelector("#weather-today");

var formSubmitHandler = function(event){
    // prevent page from refreshing
    event.preventDefault();

    //get value from input element
    var cityName= cityInputEl.value.trim();

    if(cityName){

        getTodaysWeather(cityName);
    }
    else{
        alert("Please enter a city");
    }
};

var getTodaysWeather = function(city){
    //format openWeather api url
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=4cbd25328987295e23b007fb7a00499b";
    
    //make a get request to url
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          console.log(response);
          response.json().then(function(data) {
            console.log(data);
            displayTodaysWeather(data.items);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        alert("Unable to connect to OpenWeather");
      });
};
var displayTodaysWeather = function(weather){
    // check if api returned any weather
    if(weather.length === 0){
        cityWeatherEl.textContent = "No city found.";
        return;
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);