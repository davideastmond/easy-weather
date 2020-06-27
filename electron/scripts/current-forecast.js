import {
  getForecastFromAPI,
  updateWeatherForecastUI,
} from "./weather-functions.js";

import {
  loadBackGroundFromLocalStorage,
  getFetchConfigData,
  getAutoRefreshOption,
  setTimezoneInfo,
} from "./file-system.js";

require("dotenv").config();

let refreshTimer = process.env.UPDATE_TIME;

$(async () => {
  /* When this page loads, we need to do an axios fetch request to the API
  to get weather for the city. Then call a method to update the UI and start the refresh timer
  */
  refresh();
  const result = getAutoRefreshOption(window.localStorage);
  if (result === "true") {
    startIntervalTimer();
  }
});

$(() => {
  $(".settings-icon").click((e) => {
    window.location.href = "config.html";
  });

  $(".refresh-forecast-icon").click((e) => {
    window.location.href = "current-forecast.html";
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
    showErrorMessage(null, true);

    setTimezoneInfo({
      timezone: data.timezone,
      timezone_offset: data.timezone_offset
    }, window.localStorage);

    updateWeatherForecastUI(data, window.localStorage);
  } catch (ex) {
    console.log(ex);
    showErrorMessage(ex);
  }
}

function showErrorMessage(msg, clear = false) {
  if (clear) {
    $(".error-message").css("display", "none");
    return;
  }
  if (!msg) {
    return;
  }
  $(".error-message").text(`${msg}`).css("display", "block");
}

function startIntervalTimer() {
  const timer = setInterval(() => {
    refreshTimer -= 1;
    if (refreshTimer <= 10 && refreshTimer >= 1) {
      $(".weather-forecast-auto-update").css("visibility", "visible").text(`Will update in ${refreshTimer} seconds...`);
    }

    if (refreshTimer <= 0) {
      refresh();
      refreshTimer = parseInt(process.env.UPDATE_TIME);
      $(".weather-forecast-auto-update").css("visibility", "hidden");
    }
  }, (1000));
}

function liveLoadBackgroundImage(fileName) {
  const fn = `../img/backgrounds/${fileName}`;
  $(".current-forecast-background-image").css("background-image", "url(" + fn + ")");
}
