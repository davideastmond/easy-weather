const assert = require("assert");
import {
  getFromLocalStorage
} from "./file-system.js";

window.$ = window.jQuery = require("jquery");

require("dotenv").config();
let mapObject;
$(() => {
  $(".close-config-enclosure").click((e) => {
    window.location.href = "current-forecast.html";
  });
  loadMapData(getFromLocalStorage(window.localStorage));
});

export function loadMapData(data) {
  assert(data, "data object not defined");
  mapObject = L.map('mapid').setView([data.lat, data.lon], 13);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: process.env.MAP_TILE_LAYER_API_KEY,
  }).addTo(mapObject);
  L.tileLayer('https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-{timestamp}/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    layer: 'clouds_new',
    tileSize: 512,
    zoomOffset: -1,
    timestamp: "900913-m50m",
    api_key: process.env.API_KEY,
    op: "PR0"
  }).addTo(mapObject);
}

function sampleMap() {

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: process.env.MAP_TILE_LAYER_API_KEY,
  }).addTo(mapObject);

  L.tileLayer('https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={api_key}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    layer: 'clouds_new',
    tileSize: 512,
    zoomOffset: -1,
    api_key: process.env.API_KEY,
  }).addTo(mapObject);
}
