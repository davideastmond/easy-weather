window.$ = window.jQuery = require("jquery");

require("dotenv").config();

$(() => {
  const mymap = L.map('mapid').setView([43.7315, -79.7624], 13);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: process.env.MAP_TILE_LAYER_API_KEY,
  }).addTo(mymap);

  $(".close-config-enclosure").click((e) => {
    window.location.href = "current-forecast.html";
  });
});
