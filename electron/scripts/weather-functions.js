const axios = require("axios").default;
window.$ = window.jQuery = require("jquery");
require("dotenv").config();

const moment = require("moment");
import {
  getMeasurementUnitsSymbol,
  getWeatherIconURL,
  getTimeFormat,
  TIME_FORMAT_CONVERSION
} from "./file-system.js";

import {
  getMeasurementUnitsFromLocalStorage,
  getFromLocalStorage
} from "./file-system.js";
const assert = require("assert");

import {
  weatherCard
} from "./cards/weather-card.js";
import {
  dailyCard
} from "./cards/daily-card.js";

export const WEATHER_CARD_DATE_FORMAT_CONSTANT = "ddd";

export function getWindCompassDirectionFromDegrees(degrees) {
  const compassDirections = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const value = ((degrees / 22.5) + 0.5);
  return compassDirections[Math.floor(value % 16)];
}

export function getWindSpeed(speed, units) {
  return units === "metric" ? Math.ceil(speed * 3.6) : Math.ceil(speed);
}

/**
 * Wrapper method to fetch from weather API - make sure you get the 
 * required parameters (lat, lon, key, units ) from localStorage when calling this
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
  renderWeatherIcon(data.current.weather[0].icon, ".current-conditions-icon");
  updateWindData(data.current);
  updateSunriseSunset(data.current);
  updateAtmosphericPressure(data.current);
  updateHumidity(data.current);
  updateNextTwelveHourForecast(data.hourly);
  updateNextFiveDaysForecast(data.daily);
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
  $(".temperature-actual").text(roundedTemperature(temp).toString() + getMeasurementUnitsSymbol("temperature", window.localStorage));
}

export const roundedTemperature = (temp) => Math.floor(temp);

function updateTime(time) {
  const customTime = TIME_FORMAT_CONVERSION[getTimeFormat(window.localStorage)];
  $(".date-time").text(moment.unix(time).format(`dddd, MMMM D YYYY, ${customTime}`));
}

/**
 * @param {[{}]} conditions an array of weather condition objects
 */
function updateCurrentWeatherConditions(conditions) {
  const caption = makeWeatherConditionCaptionString(conditions);

  $(".current-weather-conditions").text(caption);
  $(".weather-condition-description").text(conditions[0].description);
}

function renderWeatherIcon(iconString, jQueryElement) {
  assert($(jQueryElement).length, "jQuery element does not exist");
  $(jQueryElement).css({
    "background-image": `url("${getWeatherIconURL(iconString)}")`
  });
}

function updateTemperatureFeelsLike(temp) {
  $(".temperature-feels-like").text(`Feels like: ${roundedTemperature(temp).toString()} ${getMeasurementUnitsSymbol("temperature", window.localStorage)}`);
}

function updateWindData(data) {
  let wind_speed, wind_gust, wind_deg;
  ({
    wind_speed,
    wind_gust,
    wind_deg
  } = data);

  const windCompassDirection = getWindCompassDirectionFromDegrees(wind_deg);
  const windSpeed = getWindSpeed(wind_speed, getMeasurementUnitsFromLocalStorage(window.localStorage));
  $(".wind-speed").text(`Speed: ${windSpeed} ${getMeasurementUnitsSymbol("wind", window.localStorage)} ${windCompassDirection}`);
  $(".wind-gust").text(`Gust: ${wind_gust && getWindSpeed(wind_gust) + getMeasurementUnitsSymbol("wind", window.localStorage) || "-" }`);
}

function updateSunriseSunset(data) {
  let sunrise, sunset;
  ({
    sunrise,
    sunset
  } = data);
  const customTime = TIME_FORMAT_CONVERSION[getTimeFormat(window.localStorage)];
  $(".sun-sunrise").text(`Rise: ${moment.unix(sunrise).format(`${customTime}`)}`);
  $(".sun-sunset").text(`Set: ${moment.unix(sunset).format(`${customTime}`)}`);
}

function updateHumidity(data) {
  let humidity;
  ({
    humidity
  } = data);
  $(".humidity").text(`${humidity}%`);
}

/**
 * 
 * @param {{}} data 
 */
function updateAtmosphericPressure(data) {
  let pressure;
  ({
    pressure
  } = data);
  $(".atmospheric-pressure").text(`${pressure} ${getMeasurementUnitsSymbol("pressure", window.localStorage)}`);
}

/**
 * Returns two hourly forecasts; the now + 6, and the other now + 12
 * @param {} data 
 */
function updateNextTwelveHourForecast(data) {
  const plusSix = data[5];
  const plusTwelve = data[11];
  const customTime = TIME_FORMAT_CONVERSION[getTimeFormat(window.localStorage)];
  $(".forecast-cards-enclosure").html([{
      temperature: `${roundedTemperature(plusSix.temp)} ${getMeasurementUnitsSymbol("temperature", window.localStorage)}`,
      feels_like: `${roundedTemperature(plusSix.feels_like)} ${getMeasurementUnitsSymbol("temperature", window.localStorage)}`,
      icon_src: `${getWeatherIconURL(plusSix.weather[0].icon)}`,
      date_time: moment.unix(plusSix.dt).format(`${WEATHER_CARD_DATE_FORMAT_CONSTANT} ${customTime}`),
      condition_description: makeWeatherConditionCaptionString(plusSix.weather)
    },
    {
      temperature: `${roundedTemperature(plusTwelve.temp)} ${getMeasurementUnitsSymbol("temperature", window.localStorage)}`,
      feels_like: `${roundedTemperature(plusTwelve.feels_like)} ${getMeasurementUnitsSymbol("temperature", window.localStorage)}`,
      icon_src: `${getWeatherIconURL(plusTwelve.weather[0].icon)}`,
      date_time: moment.unix(plusTwelve.dt).format(`${WEATHER_CARD_DATE_FORMAT_CONSTANT} ${customTime}`),
      condition_description: makeWeatherConditionCaptionString(plusTwelve.weather)
    }
  ].map(weatherCard).join(''));
}

function updateNextFiveDaysForecast(data) {
  const five = data.slice(0, 5);
  $(".daily-forecast-cards-enclosure").html(five.map((forecast, index) => {
    console.log(forecast);
    return {
      temperature_high: `${roundedTemperature(forecast.temp.max)} ${getMeasurementUnitsSymbol("temperature", window.localStorage)}`,
      feels_like_high: `${roundedTemperature(forecast.feels_like.day)} ${getMeasurementUnitsSymbol("temperature", window.localStorage)}`,
      morning_temp: `${roundedTemperature(forecast.temp.morn)} ${getMeasurementUnitsSymbol("temperature", window.localStorage)}`,
      evening_temp: `${roundedTemperature(forecast.temp.eve)} ${getMeasurementUnitsSymbol("temperature", window.localStorage)}`,
      night_temp: `${roundedTemperature(forecast.temp.night)} ${getMeasurementUnitsSymbol("temperature", window.localStorage)}`,
      icon_src: `${getWeatherIconURL(forecast.weather[0].icon)}`,
      date_time: moment.unix(forecast.dt).format(`dddd`),
      condition_description: makeWeatherConditionCaptionString(forecast.weather)
    };
  }).map(dailyCard).join(""));
}
