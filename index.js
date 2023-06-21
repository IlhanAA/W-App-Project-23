function displayWeatherCondition(response) {
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
  let currentTime = new Date(response.data.dt * 1000);
  let timeZoneOffset = response.data.timezone;
  currentTime.setSeconds(currentTime.getSeconds() + timeZoneOffset);
  dateElement.innerHTML = formatDate(currentTime);
}

function displayWeeklyForecast(response) {
  let dailyForecasts = response.data.daily.slice(1, 6);
  let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let weekElements = document.querySelectorAll(".week .col");

  dailyForecasts.forEach((forecast, index) => {
    let forecastDate = new Date(forecast.dt * 1000);
    let dayOfWeek = weekDays[forecastDate.getDay()];
    let temperature = Math.round(forecast.temp.day);
    let weatherIcon = forecast.weather[0].icon;

    weekElements[index].querySelector("h6").innerHTML = dayOfWeek;
    weekElements[index].querySelector(
      "h1"
    ).innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="${forecast.weather[0].description}" />`;
    weekElements[index].querySelector("h5").innerHTML = `${temperature}°C`;
  });
}

function search(city) {
  let apiKey = "d67bbe29313bc14b75d0c7a4f0128bd6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);

  // Fetch weekly forecast
  let apiForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`;
  axios.get(apiForecastUrl).then(displayWeeklyForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  search(city);
}

function searchCurrent(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(function (position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiKey = "d67bbe29313bc14b75d0c7a4f0128bd6";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayWeatherCondition);
    let apiForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`;
    axios.get(apiForecastUrl).then(displayWeeklyForecast);
  });
}

function formatDate(date) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  let hours = date.getHours().toString().padStart(2, "0");
  let minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${hours}:${minutes}`;
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", searchCurrent);

search("London");
