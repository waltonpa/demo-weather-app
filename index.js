function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}

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

  console.log("Weather API Response:", response.data);
}
function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    let forecast = response.data.daily[i];
    let forecastDate = new Date(forecast.dt * 1000);
    let forecastDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      forecastDate.getDay()
    ];
    let forecastTemperature = Math.round(forecast.temp.day);
    let forecastDescription = forecast.weather[0].main;

    forecastElement.innerHTML += `
        <div class="forecast-day">
          <div class="forecast-date">${forecastDay}</div>
          <div class="forecast-temperature">${forecastTemperature}°C</div>
          <div class="forecast-description">${forecastDescription}</div>
        </div>
      `;

    console.log("Forecast API Response:", forecast);
  }
}

function searchCity(city) {
  let apiKey = "cabdbda40038ba7d1165b953b1c7bd6c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(searchLocation);
  }
}

function searchLocation(position) {
  let apiKey = "cabdbda40038ba7d1165b953b1c7bd6c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then((response) => {
    displayWeatherCondition(response);
    let forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`;
    axios.get(forecastApiUrl).then(displayForecast);
  });
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

let dateElement = document.querySelector("#date");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(searchLocation);
  }
});
searchCity("Peoria");
