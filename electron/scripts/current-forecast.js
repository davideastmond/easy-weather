window.$ = window.jQuery = require("jquery");
require("dotenv").config();
const axios = require("axios").default;
const degreeSymbol = "°";
const moment = require("moment");

$(async()=> {
  /* When this page loads, we need to do an axios fetch request to the API
  to get weather for the city. Then call a method to update the UI
  */
  try {
    const { data } = await getForecastFromAPI();
    updateWeatherForecastUI(data);
  } catch (ex) {
    alert(ex);
  }
});

/**
 * Helper method to pull from localStorage and do fetch
 * @returns {Promise<any>} the results of the axios.get request
 */
async function getForecastFromAPI() {
  const savedCityInfo = getFromLocalStorage();
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${savedCityInfo.lat}&lon=${savedCityInfo.lon}&appid=${process.env.API_KEY}&units=metric`;
  
  return await axios.get(url);
}

/**
 * Extracts relevant data from API response and updates the UI
 * @param {{}} data data received from weatherAPI
 */
function updateWeatherForecastUI(data) {
  console.log(data);
  updateCityName(getFromLocalStorage().city_name);
  updateTemperature(data.current.temp);
  updateTemperatureFeelsLike(data.current.feels_like);
  updateTime(data.current.dt);
  updateCurrentWeatherConditions(data.current.weather); // this is an array of weather conditions
  updateWeatherIcon(data.current.weather[0].icon);
  updateWindData(data.current);
  updateSunriseSunset(data.current)
}

/**
 * Helper updates city name via jquery
 * @param {string}
 * @param {} data 
 */
function updateCityName(cityName) {
  $(".city-name").text(cityName);
}

function updateTemperature(temp) {
  // Round the temperature
  const roundedTemperature = Math.floor(temp);
  $(".temperature-actual").text(Math.floor(roundedTemperature).toString() + degreeSymbol + "C");
}

function updateTime(time) {
  $(".date-time").text(moment.unix(time).format("dddd, MMMM D YYYY, HH:mm"));
}

/**
 * @param {[{}]} conditions an array of weather condition objects
 */
function updateCurrentWeatherConditions(conditions) {
  const caption = conditions.reduce((acc, cv) => {
    acc += cv.main;
    return acc;
  }, "");

 $(".current-weather-conditions").text(caption);
 $(".weather-condition-description").text(conditions[0].description);
}

function updateWeatherIcon(iconString) {
  const iconURL = `http://openweathermap.org/img/wn/${iconString}@2x.png`;
  $(".current-conditions-icon").css({ "background-image" : `url("${iconURL}")` });
}

function updateTemperatureFeelsLike(temp) {
  const roundedTemperature = Math.floor(temp);
  $(".temperature-feels-like").text(`Feels like: ${Math.floor(roundedTemperature).toString()}${degreeSymbol} C`);
}

function updateWindData(data) {
  let wind_speed, wind_gust, wind_deg;
  ({ wind_speed, wind_gust, wind_deg } = data);

  const windCompassDirection = getWindCompassDirectionFromDegrees(wind_deg);
  const windSpeedInKmHr = getWindSpeedInKmPerHour(wind_speed);
  $(".wind-speed").text( `Speed: ${windSpeedInKmHr} km/h ${windCompassDirection}`);
  $(".wind-gust").text(`Gust: ${wind_gust && getWindSpeedInKmPerHour(wind_gust) + " km/h" || "-" }`);
}

function updateSunriseSunset(data) {
  let sunrise, sunset;
  ({ sunrise, sunset } = data);
  
  $(".sun-sunrise").text(`Rise ${moment.unix(sunrise).format("HH:mm")}`);
  $(".sun-sunset").text(`Set ${moment.unix(sunset).format("HH:mm")}`);
}

function getWindCompassDirectionFromDegrees(degrees) {
  const compassDirections = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const value = ((degrees / 22.5) + 0.5);
  return compassDirections[Math.ceil(value % 16)];
}

function getWindSpeedInKmPerHour(speedInMetresPerSecond) {
  return Math.ceil(speedInMetresPerSecond * 3.6);
}

function getFromLocalStorage() {
  return JSON.parse(window.localStorage.getItem("saved_city_data"));
}
