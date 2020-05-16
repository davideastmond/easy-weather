import {
  getForecastFromAPI,
  updateWeatherForecastUI,
} from "./weather-functions.js";

import {
  loadBackGroundFromLocalStorage,
  getFetchConfigData
} from "./file-system.js";

const assert = require("assert");
require("dotenv").config();

let refreshTimer = 120;

$(async () => {
  /* When this page loads, we need to do an axios fetch request to the API
  to get weather for the city. Then call a method to update the UI and start the refresh timer
  */
  refresh();
  startIntervalTimer();
});

$(() => {
  $(".settings-icon").click((e) => {
    window.location.href = "config.html";
  });
});

async function refresh() {
  loadBackGroundFromLocalStorage(window.localStorage, liveLoadBackgroundImage);
  let key, lat, lon, units;
  ({
    key,
    lat,
    lon,
    units
  } = getFetchConfigData(window.localStorage));
  try {
    const {
      data
    } = await getForecastFromAPI(lat, lon, key, units);
    updateWeatherForecastUI(data);
  } catch (ex) {
    console.log(ex);
  }
}

function startIntervalTimer() {
  const timer = setInterval(() => {
    refreshTimer -= 1;
    if (refreshTimer <= 10 && refreshTimer >= 1) {
      $(".weather-forecast-auto-update").css("visibility", "visible").text(`Will update in ${refreshTimer} seconds...`);
    }
    if (refreshTimer <= 0) {
      refresh();
      refreshTimer = 120;
      $(".weather-forecast-auto-update").css("visibility", "hidden");
    }
  }, (1000));
}

function liveLoadBackgroundImage(fileName) {
  const fn = `../img/backgrounds/${fileName}`;
  $(".current-forecast-background-image").css("background-image", "url(" + fn + ")");
}