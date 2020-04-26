
import { getForecastFromAPI,
  updateWeatherForecastUI, getFromLocalStorage } from "./weather-functions.js";

import { getMeasurementUnitsFromLocalStorage } from "./measurement-units.js";
const assert = require("assert");
require("dotenv").config();

$(async()=> {
  /* When this page loads, we need to do an axios fetch request to the API
  to get weather for the city. Then call a method to update the UI
  */
 loadBackGroundFromLocalStorage(window.localStorage);
  const key = process.env.API_KEY;
  const savedCityInfo = getFromLocalStorage(window.localStorage);
  const units = getMeasurementUnitsFromLocalStorage(window.localStorage);
  try {
    const { data } = await getForecastFromAPI(savedCityInfo.lat, savedCityInfo.lon, key, units);
    updateWeatherForecastUI(data);
  } catch (ex) {
    console.log(ex);
  }
});

$(()=> {
  $(".settings-icon").click((e) => {
    window.location.href = " config.html";
  });
});

function liveLoadBackgroundImage(fileName) {
  const fn = `../img/backgrounds/${fileName}`;
  $(".current-forecast-background-image ").css("background-image", "url(" + fn + ")");
}

function loadBackGroundFromLocalStorage(storage) {
  assert(storage.getItem, "supply a valid local storage object")
  const currentImage = storage.getItem("backgroundImage");
  if (currentImage !== "undefined") {
    liveLoadBackgroundImage(currentImage);
  } else {
    liveLoadBackgroundImage("background_003_blue_sea_sky.jpg");
    storage.setItem("backgroundImage", "background_003_blue_sea_sky.jpg");
  }
}