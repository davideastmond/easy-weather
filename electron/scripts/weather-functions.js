const axios = require("axios").default;
window.$ = window.jQuery = require("jquery");
require("dotenv").config();

const degreeSymbol = "°";
const moment = require("moment");
import { getMeasurementUnitsFromLocalStorage, getMeasurementUnitsSymbol } from "./measurement-units.js";
const assert = require("assert");

export function getWindCompassDirectionFromDegrees(degrees) {
  const compassDirections = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const value = ((degrees / 22.5) + 0.5);
  return compassDirections[Math.floor(value % 16)];
}

export function getWindSpeed(speed, units) {
  return units === "metric" ? Math.ceil(speed * 3.6) : Math.ceil(speed);
}

/**
 * Helper method to pull from localStorage and do fetch
 * @returns {Promise<any>} the results of the axios.get request
 */
export async function getForecastFromAPI(lat, lon, key, units) {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&units=${units}`;
  return await axios.get(url);
}

/**
* @param conditions {string[]}
 */
export function makeWeatherConditionCaptionString(conditions) {
  return conditions.reduce((acc, cv) => {
    acc += cv.main;
    return acc + " ";
  }, "").trim();
}

/**
* Extracts relevant data from API response and updates the UI
* @param {{}} data data received from weatherAPI
*/
export function updateWeatherForecastUI(data) {
  console.log(data);
  updateCityName(getFromLocalStorage(window.localStorage).city_name);
  updateTemperature(data.current.temp);
  updateTemperatureFeelsLike(data.current.feels_like);
  updateTime(data.current.dt);
  updateCurrentWeatherConditions(data.current.weather); // this is an array of weather conditions
  updateWeatherIcon(data.current.weather[0].icon);
  updateWindData(data.current);
  updateSunriseSunset(data.current);
  updateAtmosphericPressure(data.current);
  updateHumidity(data.current);
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
  const roundedTemperature = Math.floor(temp);
  $(".temperature-actual").text(Math.floor(roundedTemperature).toString() + getMeasurementUnitsSymbol("temperature", window.localStorage));
}

function updateTime(time) {
  $(".date-time").text(moment.unix(time).format("dddd, MMMM D YYYY, HH:mm"));
}

/**
 * @param {[{}]} conditions an array of weather condition objects
 */
function updateCurrentWeatherConditions(conditions) {
  const caption = makeWeatherConditionCaptionString(conditions);

 $(".current-weather-conditions").text(caption);
 $(".weather-condition-description").text(conditions[0].description);
}

function updateWeatherIcon(iconString) {
  const iconURL = `http://openweathermap.org/img/wn/${iconString}@2x.png`;
  $(".current-conditions-icon").css({ "background-image" : `url("${iconURL}")` });
}

function updateTemperatureFeelsLike(temp) {
  const roundedTemperature = Math.floor(temp);
  $(".temperature-feels-like").text(`Feels like: ${Math.floor(roundedTemperature).toString()} ${getMeasurementUnitsSymbol("temperature", window.localStorage)}`);
}

function updateWindData(data) {
  let wind_speed, wind_gust, wind_deg;
  ({ wind_speed, wind_gust, wind_deg } = data);

  const windCompassDirection = getWindCompassDirectionFromDegrees(wind_deg);
  const windSpeed = getWindSpeed(wind_speed, getMeasurementUnitsFromLocalStorage(window.localStorage));
  $(".wind-speed").text(`Speed: ${windSpeed} ${getMeasurementUnitsSymbol("wind", window.localStorage)} ${windCompassDirection}`);
  $(".wind-gust").text(`Gust: ${wind_gust && getWindSpeed(wind_gust) + getMeasurementUnitsSymbol("wind", window.localStorage) || "-" }`);
}

function updateSunriseSunset(data) {
  let sunrise, sunset;
  ({ sunrise, sunset } = data);
  
  $(".sun-sunrise").text(`Rise: ${moment.unix(sunrise).format("HH:mm")}`);
  $(".sun-sunset").text(`Set: ${moment.unix(sunset).format("HH:mm")}`);
}

function updateHumidity(data) {
  let humidity;
  ({ humidity } = data);
  $(".humidity").text(`${humidity}%`);
}

/**
 * 
 * @param {{}} storage should be window.localStorage object
 * @returns {string}
 */
export function getFromLocalStorage(storage) {
  assert(storage.getItem, "Incorrect local storage object passed to this method");
  return JSON.parse(storage.getItem("saved_city_data"));
}

/**
 * 
 * @param {{}} data 
 */
function updateAtmosphericPressure(data) {
  let pressure;
  ({ pressure } = data);
  $(".atmospheric-pressure").text(`${pressure} ${getMeasurementUnitsSymbol("pressure", window.localStorage)}`);
}