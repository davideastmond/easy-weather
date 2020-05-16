window.$ = window.jQuery = require("jquery");
import {
  loadBackGroundFromLocalStorage,
  getFetchConfigData
} from "./file-system.js";

import {
  getForecastFromAPI
} from "./weather-functions.js";

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
async function updateHourlyForecast(maxHrs = 12) {
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

  const hourlyObjects = data.hourly.slice(0, maxHrs + 1);

  $(".hourly-forecast-table-body").html(hourlyObjects.map((forecast) => {
    return {
      styling: "tr-class-row-dark",
      dateTime: forecast.dt,
      temp: forecast.temp,
      feels_like: forecast.feels_like,
      desc: forecast.weather[0].main
    };
  }).map(hourlyStrip).join(''));
}
/**
 * an hourlyStrip is a row of hourly data from the API.
 * This is a template
 *  
 */
export const hourlyStrip = ({
  styling,
  dateTime,
  temp,
  feels_like,
  icon,
  desc,
  wind
}) => `
<tr class="${styling}">
  <td>${dateTime}</td>
  <td>${temp}</td>
  <td>${feels_like}</td>
  <td>${icon}</td>
  <td>${desc}</td>
  <td>${wind}</td>
</tr>`;