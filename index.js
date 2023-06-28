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

function getForecast(coords) {
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${coords.latitude}&lon=${coords.longitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayWeatherForecast(response) {
  let weatherForecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row">`;
  weatherForecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML += `
        <div class="col-2 forecastDay">
          <div class="forecast-date">${formatDay(forecastDay.time)}</div>
          <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
            forecastDay.condition.icon
          }.png" alt="" width="42" />
          <div class="forecast-temp">
            <span class="max">${Math.round(
              forecastDay.temperature.maximum
            )}°</span>
            <span class="min">${Math.round(
              forecastDay.temperature.minimum
            )}°</span>
          </div>
        </div>
      `;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
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

document.querySelector("#search-form").addEventListener("submit", handleSubmit);

document
  .querySelector("#current-location-button")
  .addEventListener("click", searchCurrent);

// Call the searchCurrent function by default to display weather for the user's current location
searchCurrent();
