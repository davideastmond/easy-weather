window.$ = window.jQuery = require("jquery");
import {
  loadBackGroundFromLocalStorage
} from "./file-system.js";


$(() => {
  // When this window loads, load selected background
  loadBackGroundFromLocalStorage(window.localStorage, liveLoadBackgroundImage);
});

function liveLoadBackgroundImage(fileName) {
  const fn = `../img/backgrounds/${fileName}`;
  $(".hourly-window").css("background-image", "url(" + fn + ")");
}