const axios = require("axios").default;
window.$ = window.jQuery = require("jquery");
require("dotenv").config();

const moment = require("moment-timezone");
import {
  getMeasurementUnitsSymbol,
  getWeatherIconURL,
  getTimeFormat,
  TIME_FORMAT_CONVERSION,
  getTimeZone,
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

import {
  getConvertedTime
} from "./time-functions.js";

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
export function updateWeatherForecastUI(data, storage) {
  console.log(data);
  updateCityName(getFromLocalStorage(storage).city_name);
  updateTemperature(data.current.temp, storage);
  updateTemperatureFeelsLike(data.current.feels_like, storage);
  updateTime(data.current.dt, storage);
  updateCurrentWeatherConditions(data.current.weather, storage); // this is an array of weather conditions
  renderWeatherIcon(data.current.weather[0].icon, ".current-conditions-icon", storage);
  updateWindData(data.current, storage);
  updateSunriseSunset(data.current, storage);
  updateAtmosphericPressure(data.current, storage);
  updateHumidity(data.current, storage);
  updateNextTwelveHourForecast(data.hourly, storage);
  updateNextFiveDaysForecast(data.daily, storage);
}

/**
 * Helper updates city name via jquery
 * @param {string}
 * @param {} data 
 */
function updateCityName(cityName) {
  $(".city-name").text(cityName);
}

function updateTemperature(temp, storage) {
  $(".temperature-actual").text(roundedTemperature(temp).toString() + getMeasurementUnitsSymbol("temperature", storage));
}

export const roundedTemperature = (temp) => Math.floor(temp);

function updateTime(time, storage) {
  const customTime = TIME_FORMAT_CONVERSION[getTimeFormat(storage)];
  const formatSpec = `dddd, MMMM D YYYY, ${customTime}`;
  let timezone;
  console.log("102 storage", storage);
  ({
    timezone
  } = getTimeZone(storage));

  console.log("106", timezone);
  const localizedTime = getConvertedTime(time, timezone, formatSpec);
  $(".date-time").text(localizedTime);
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

function updateTemperatureFeelsLike(temp, storage) {
  $(".temperature-feels-like").text(`Feels like: ${roundedTemperature(temp).toString()} ${getMeasurementUnitsSymbol("temperature", storage)}`);
}

function updateWindData(data, storage) {
  let wind_speed, wind_gust, wind_deg;
  ({
    wind_speed,
    wind_gust,
    wind_deg
  } = data);

  const windCompassDirection = getWindCompassDirectionFromDegrees(wind_deg);
  const windSpeed = getWindSpeed(wind_speed, getMeasurementUnitsFromLocalStorage(storage));
  $(".wind-speed").text(`Speed: ${windSpeed} ${getMeasurementUnitsSymbol("wind", storage)} ${windCompassDirection}`);
  $(".wind-gust").text(`Gust: ${wind_gust && getWindSpeed(wind_gust) + getMeasurementUnitsSymbol("wind", storage) || "-" }`);
}

function updateSunriseSunset(data, storage) {
  let sunrise, sunset, timezone;
  ({
    sunrise,
    sunset
  } = data);

  ({
    timezone
  } = getTimeZone(storage));

  const customTime = TIME_FORMAT_CONVERSION[getTimeFormat(storage)];
  $(".sun-sunrise").text(`Rise: ${getConvertedTime(sunrise, timezone, customTime)}`);
  $(".sun-sunset").text(`Set: ${getConvertedTime(sunset, timezone, customTime )}`);
}

function updateHumidity(data) {
  let humidity;
  ({
    humidity
  } = data);
  $(".humidity").text(`${humidity}%`);
}

/**
 * @param {{}} data 
 */
function updateAtmosphericPressure(data, storage) {
  let pressure;
  ({
    pressure
  } = data);
  $(".atmospheric-pressure").text(`${pressure} ${getMeasurementUnitsSymbol("pressure", storage)}`);
}

/**
 * Returns two hourly forecasts; the now + 6 hours, and the other now + 12 hours
 * @param {} data 
 */
function updateNextTwelveHourForecast(data, storage) {
  const plusSix = data[5];
  const plusTwelve = data[11];
  const customTime = TIME_FORMAT_CONVERSION[getTimeFormat(storage)];
  const timeFormat = `${WEATHER_CARD_DATE_FORMAT_CONSTANT} ${customTime}`;
  let timezone;
  ({
    timezone
  } = getTimeZone(storage));

  $(".forecast-cards-enclosure").html([{
      temperature: `${roundedTemperature(plusSix.temp)} ${getMeasurementUnitsSymbol("temperature", storage)}`,
      feels_like: `${roundedTemperature(plusSix.feels_like)} ${getMeasurementUnitsSymbol("temperature", storage)}`,
      icon_src: `${getWeatherIconURL(plusSix.weather[0].icon)}`,
      date_time: getConvertedTime(plusSix.dt, timezone, timeFormat),
      condition_description: makeWeatherConditionCaptionString(plusSix.weather),
      wind_speed: `${getWindSpeed(plusSix.wind_speed, getMeasurementUnitsFromLocalStorage(storage))} ${getMeasurementUnitsSymbol("wind", storage)}`,
      wind_direction: getWindCompassDirectionFromDegrees(plusSix.wind_deg)
    },
    {
      temperature: `${roundedTemperature(plusTwelve.temp)} ${getMeasurementUnitsSymbol("temperature", storage)}`,
      feels_like: `${roundedTemperature(plusTwelve.feels_like)} ${getMeasurementUnitsSymbol("temperature", storage)}`,
      icon_src: `${getWeatherIconURL(plusTwelve.weather[0].icon)}`,
      date_time: getConvertedTime(plusTwelve.dt, timezone, timeFormat),
      condition_description: makeWeatherConditionCaptionString(plusTwelve.weather),
      wind_speed: `${getWindSpeed(plusTwelve.wind_speed, getMeasurementUnitsFromLocalStorage(storage))} ${getMeasurementUnitsSymbol("wind", storage)}`,
      wind_direction: getWindCompassDirectionFromDegrees(plusTwelve.wind_deg)
    }
  ].map(weatherCard).join(''));
}

function updateNextFiveDaysForecast(data, storage) {
  const five = data.slice(0, 5);

  let timezone;
  ({
    timezone
  } = getTimeZone(storage));

  const timeFormat = "dddd";
  $(".daily-forecast-cards-enclosure").html(five.map((forecast, index) => {
    console.log(forecast);
    return {
      temperature_high: `${roundedTemperature(forecast.temp.max)} ${getMeasurementUnitsSymbol("temperature", storage)}`,
      feels_like_high: `${roundedTemperature(forecast.feels_like.day)} ${getMeasurementUnitsSymbol("temperature", storage)}`,
      morning_temp: `${roundedTemperature(forecast.temp.morn)} ${getMeasurementUnitsSymbol("temperature", storage)}`,
      evening_temp: `${roundedTemperature(forecast.temp.eve)} ${getMeasurementUnitsSymbol("temperature", storage)}`,
      night_temp: `${roundedTemperature(forecast.temp.night)} ${getMeasurementUnitsSymbol("temperature", storage)}`,
      icon_src: `${getWeatherIconURL(forecast.weather[0].icon)}`,
      date_time: getConvertedTime(forecast.dt, timezone, timeFormat),
      condition_description: makeWeatherConditionCaptionString(forecast.weather),
      wind_speed: `${getWindSpeed(forecast.wind_speed, getMeasurementUnitsFromLocalStorage(storage))} ${getMeasurementUnitsSymbol("wind", window.localStorage)}`,
      wind_direction: getWindCompassDirectionFromDegrees(forecast.wind_deg)
    };
  }).map(dailyCard).join(""));
}
