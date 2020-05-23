window.$ = window.jQuery = require("jquery");
import {
  loadBackGroundFromLocalStorage,
  getFetchConfigData,
  getWeatherIconURL,
  getMeasurementUnitsSymbol,
  getMeasurementUnitsFromLocalStorage,
  TIME_FORMAT_CONVERSION,
  getTimeFormat,
  numberInRange
} from "./file-system.js";

import {
  getForecastFromAPI,
  roundedTemperature,
  getWindCompassDirectionFromDegrees,
  getWindSpeed,
  WEATHER_CARD_DATE_FORMAT_CONSTANT
} from "./weather-functions.js";

import {
  hourlyStrip
} from "./cards/hourly-long-card.js";

const moment = require("moment");

$(() => {
  loadBackGroundFromLocalStorage(window.localStorage, liveLoadBackgroundImage);
  updateHourlyForecast();
  $(".close-config-enclosure").click((e) => {
    window.location.href = "current-forecast.html";
  });
});

function liveLoadBackgroundImage(fileName) {
  const fn = `../img/backgrounds/${fileName}`;
  $(".hourly-window").css("background-image", "url(" + fn + ")");
}

/**
 * Fetches from API and then spawns rows to populate the table
 * of hourly forecast data
 */
async function updateHourlyForecast(maxHrs = 48) {
  if (!numberInRange(maxHrs, 48, 12)) maxHrs = 48;
  let lat, lon, key, units, data;
  ({
    lat,
    lon,
    key,
    units
  } = getFetchConfigData(window.localStorage));

  ({
    data
  } = await getForecastFromAPI(lat, lon, key, units));

  const hourlyObjects = data.hourly.slice(0, maxHrs);

  // Instead of accessing localStorage to get measurement units for each pass in the 
  // map we access localStorage once before the map begins.
  const temperatureUnits = getMeasurementUnitsSymbol("temperature", window.localStorage);
  const windSpeedUnits = getMeasurementUnitsSymbol("wind", window.localStorage);
  const measurementUnits = getMeasurementUnitsFromLocalStorage(window.localStorage);
  const timeFormat = TIME_FORMAT_CONVERSION[getTimeFormat(window.localStorage)];
  const convertedFormat = `${WEATHER_CARD_DATE_FORMAT_CONSTANT} ${timeFormat}`;

  $(".hourly-forecast-table-body").html(hourlyObjects.map((forecast, index) => {
    return {
      styling: index % 2 == 0 ? "tr-class-row-dark" : "tr-class-row-light",
      dateTime: moment.unix(forecast.dt).format(convertedFormat),
      temp: `${roundedTemperature(forecast.temp)} ${temperatureUnits}`,
      feels_like: `${roundedTemperature(forecast.feels_like)} ${temperatureUnits}`,
      icon: getWeatherIconURL(forecast.weather[0].icon),
      main_desc: `${forecast.weather[0].main}`,
      sup_desc: `${forecast.weather[0].description}`,
      wind: `${getWindSpeed(forecast.wind_speed, measurementUnits)} ${windSpeedUnits} ${getWindCompassDirectionFromDegrees(forecast.wind_deg)}`
    };
  }).map(hourlyStrip).join(''));
}
