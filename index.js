const apiKey = "d67bbe29313bc14b75d0c7a4f0128bd6";

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

function displayWeeklyWeatherForecast(forecastData) {
  let forecastContainer = document.querySelector("#forecast-container");
  forecastContainer.innerHTML = ""; // Clear previous forecast data

  forecastData.forEach((forecast) => {
    let forecastCard = document.createElement("div");
    forecastCard.classList.add("forecast-card");

    let dateElement = document.createElement("div");
    dateElement.classList.add("forecast-date");
    dateElement.innerHTML = forecast.date;
    forecastCard.appendChild(dateElement);

    let temperatureElement = document.createElement("div");
    temperatureElement.classList.add("forecast-temperature");
    temperatureElement.innerHTML = Math.round(forecast.temperature) + "°C";
    forecastCard.appendChild(temperatureElement);

    let descriptionElement = document.createElement("div");
    descriptionElement.classList.add("forecast-description");
    descriptionElement.innerHTML = forecast.description;
    forecastCard.appendChild(descriptionElement);

    forecastContainer.appendChild(forecastCard);
  });
}

function search(city) {
  let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  axios
    .all([axios.get(currentWeatherUrl), axios.get(forecastUrl)])
    .then(
      axios.spread((currentWeatherResponse, forecastResponse) => {
        displayWeatherCondition(currentWeatherResponse);
        let forecastData = forecastResponse.data.list.map((forecast) => {
          return {
            date: formatDate(new Date(forecast.dt * 1000)),
            temperature: forecast.main.temp,
            description: forecast.weather[0].description,
          };
        });
        displayWeeklyWeatherForecast(forecastData);
      })
    )
    .catch((error) => {
      console.log(error);
      throw new Error("Unable to fetch weather data.");
    });
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

  navigator.geolocation.getCurrentPosition(function (position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    axios
      .all([axios.get(currentWeatherUrl), axios.get(forecastUrl)])
      .then(
        axios.spread((currentWeatherResponse, forecastResponse) => {
          cityElement.innerHTML = currentWeatherResponse.data.name;
          temperatureElement.innerHTML = Math.round(
            currentWeatherResponse.data.main.temp
          );
          document.querySelector("#humidity").innerHTML =
            currentWeatherResponse.data.main.humidity;
          document.querySelector("#wind").innerHTML = Math.round(
            currentWeatherResponse.data.wind.speed
          );
          document.querySelector("#description").innerHTML =
            currentWeatherResponse.data.weather[0].main;

          let forecastData = forecastResponse.data.list.map((forecast) => {
            return {
              date: formatDate(new Date(forecast.dt * 1000)),
              temperature: forecast.main.temp,
              description: forecast.weather[0].description,
            };
          });
          displayWeeklyWeatherForecast(forecastData);
        })
      )
      .catch((error) => {
        console.log(error);
        throw new Error("Unable to fetch weather data.");
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
