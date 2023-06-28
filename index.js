(() => {
  const apiKey = "d67bbe29313bc14b75d0c7a4f0128bd6"; 
  // Get weather data for a specific location
  function getWeatherData(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    return axios.get(apiUrl);
  }

  // Get weather forecast data for a specific location
  function getForecastData(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
    return axios.get(apiUrl);
  }

  // Format date string
  function formatDate(dateString) {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  // Display current weather data
  function displayCurrentWeather(weatherData) {
    const { name, main, weather } = weatherData;
    const { temp } = main;
    const { description, icon } = weather[0];

    const cityElement = document.querySelector(".weather-city");
    const temperatureElement = document.querySelector(".weather-temperature");
    const descriptionElement = document.querySelector(".weather-description");
    const iconElement = document.querySelector(".weather-icon");

    cityElement.textContent = name;
    temperatureElement.textContent = Math.round(temp);
    descriptionElement.textContent = description;
    iconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/w/${icon}.png`
    );
  }

  // Display weather forecast data
  function displayForecastData(forecastData) {
    const forecastElement = document.querySelector(".weather-forecast");

    // Clear previous forecast data
    forecastElement.innerHTML = "";

    // Display forecast for each day
    for (let i = 0; i < forecastData.length; i++) {
      const { dt_txt, main, weather } = forecastData[i];
      const { temp } = main;
      const { icon } = weather[0];

      const forecastDayElement = document.createElement("div");
      forecastDayElement.className = "forecast-day";

      const dateElement = document.createElement("p");
      dateElement.textContent = formatDate(dt_txt);
      forecastDayElement.appendChild(dateElement);

      const iconElement = document.createElement("img");
      iconElement.className = "weather-icon";
      iconElement.setAttribute(
        "src",
        `http://openweathermap.org/img/w/${icon}.png`
      );
      forecastDayElement.appendChild(iconElement);

      const temperatureElement = document.createElement("p");
      temperatureElement.textContent = Math.round(temp);
      forecastDayElement.appendChild(temperatureElement);

      forecastElement.appendChild(forecastDayElement);
    }
  }

  // Get the location from the search input and fetch weather data
  function searchWeather(event) {
    event.preventDefault();
    const searchInput = document.querySelector(".search-input");
    const location = searchInput.value;

    if (location) {
      getWeatherData(location)
        .then((response) => {
          const { data } = response;
          displayCurrentWeather(data);
        })
        .catch((error) => {
          console.log("Error:", error);
        });

      getForecastData(location)
        .then((response) => {
          const { data } = response;
          const forecastData = data.list.filter((item) =>
            item.dt_txt.includes("12:00:00")
          );
          displayForecastData(forecastData);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  }

  // Add event listener to the search form
  const searchForm = document.querySelector(".search-form");
  searchForm.addEventListener("submit", searchWeather);
})();
