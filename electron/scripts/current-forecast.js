
import { getForecastFromAPI,
  updateWeatherForecastUI } from "./weather-functions.js";

$(async()=> {
  /* When this page loads, we need to do an axios fetch request to the API
  to get weather for the city. Then call a method to update the UI
  */
 loadBackGroundFromLocalStorage();
  try {
    const { data } = await getForecastFromAPI();
    updateWeatherForecastUI(data);
  } catch (ex) {
    alert(ex);
  }
});

function liveLoadBackgroundImage(fileName) {
  const fn = `../img/backgrounds/${fileName}`;
  $(".current-forecast-background-image ").css("background-image", "url(" + fn + ")");
}

function loadBackGroundFromLocalStorage() {
  const sStorage = window.localStorage;
  const currentImage = sStorage.getItem("backgroundImage");
  if (currentImage) {
    liveLoadBackgroundImage(currentImage);
  }
}