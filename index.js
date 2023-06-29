function formatDate(date) {
  return date.toLocaleString(undefined, {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let celsiusTemperature = temperatureElement.innerHTML;
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  document.querySelector("#temperature-unit").innerHTML = "°F";
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitTemperature = temperatureElement.innerHTML;
  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  document.querySelector("#temperature-unit").innerHTML = "°C";
}

function displayWeatherCondition(response) {
  // Update the weather information on the page
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  // Update the date and time
  let dateElement = document.querySelector("#date");
  let currentTime = new Date(response.data.dt * 1000); // Convert Unix timestamp to milliseconds
  let timeZoneOffset = response.data.timezone; // Time zone offset in seconds
  currentTime.setSeconds(currentTime.getSeconds() + timeZoneOffset); // Adjust the time with the time zone offset
  dateElement.innerHTML = formatDate(currentTime);
}

function search(city) {
  let apiKey = "d67bbe29313bc14b75d0c7a4f0128bd6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  search(city);
}

function searchCurrent(event) {
  event.preventDefault();
  let cityElement = document.querySelector("#city");
  let temperatureElement = document.querySelector("#temperature");
  let apiKey = "d67bbe29313bc14b75d0c7a4f0128bd6";

  navigator.geolocation.getCurrentPosition(function (position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    axios.get(url).then(function (response) {
      cityElement.innerHTML = response.data.name;
      temperatureElement.innerHTML = Math.round(response.data.main.temp);
      document.querySelector("#humidity").innerHTML =
        response.data.main.humidity;
      document.querySelector("#wind").innerHTML = Math.round(
        response.data.wind.speed
      );
      document.querySelector("#description").innerHTML =
        response.data.weather[0].main;

      // Update the date and time
      let dateElement = document.querySelector("#date");
      let currentTime = new Date(response.data.dt * 1000); // Convert Unix timestamp to milliseconds
      let timeZoneOffset = response.data.timezone; // Time zone offset in seconds
      currentTime.setSeconds(currentTime.getSeconds() + timeZoneOffset); // Adjust the time with the time zone offset
      dateElement.innerHTML = formatDate(currentTime);
    });
  });
}

let dateElement = document.querySelector("#date");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

let currentForm = document.querySelector("#current-weather");
currentForm.addEventListener("click", searchCurrent);

search("Paris");
