window.$ = window.jQuery = require("jquery");
import {
  loadBackGroundFromLocalStorage
} from "./file-system.js";


$(() => {
  // When this window loads, load selected background
  loadBackGroundFromLocalStorage(window.localStorage, liveLoadBackgroundImage);

  $(".close-config-enclosure").click((e) => {
    window.location.href = "current-forecast.html";
  });
});

function liveLoadBackgroundImage(fileName) {
  const fn = `../img/backgrounds/${fileName}`;
  $(".hourly-window").css("background-image", "url(" + fn + ")");
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