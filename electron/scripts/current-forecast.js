
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

$(()=> {
  $(".settings-icon").click((e) => {
    window.location.href = " config.html";
  });
});

function liveLoadBackgroundImage(fileName) {
  const fn = `../img/backgrounds/${fileName}`;
  $(".current-forecast-background-image ").css("background-image", "url(" + fn + ")");
}

function loadBackGroundFromLocalStorage() {
  const currentImage = window.localStorage.getItem("backgroundImage");
  if (currentImage !== "undefined") {
    liveLoadBackgroundImage(currentImage);
  } else {
    liveLoadBackgroundImage("background_003_blue_sea_sky.jpg");
    sStorage.setItem("backgroundImage", "background_003_blue_sea_sky.jpg");
  }
}