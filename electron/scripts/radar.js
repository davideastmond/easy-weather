const assert = require("assert");
import {
  getFromLocalStorage
} from "./file-system.js";

window.$ = window.jQuery = require("jquery");

require("dotenv").config();
//let mapObject;

const SATELLITE_VIEW = "mapbox/satellite-v9";
const DEFAULT_STREET_VIEW = "mapbox/streets-v11";

$(() => {
  $(".close-settings-icon").click((e) => {
    window.location.href = "current-forecast.html";
  });

  $(".fa-road").click((e) => {
    if ($(".fa-road").hasClass("selected")) {
      return;
    } else {
      $(".fa-road").toggleClass("selected");
      $(".fa-satellite").toggleClass("selected");
      window.localStorage.setItem("mapview", DEFAULT_STREET_VIEW);
      window.location = "radar.html";
    }
  });

  $(".fa-satellite").click((e) => {
    if ($(".fa-satellite").hasClass("selected")) {
      return;
    } else {
      $(".fa-road").toggleClass("selected");
      $(".fa-satellite").toggleClass("selected");
      window.localStorage.setItem("mapview", SATELLITE_VIEW);
      window.location = "radar.html";
    }
  });

  $(".fa-sync-alt").click((e) => {
    window.location = "radar.html";
  });

  loadConfigureMap();
});

function loadConfigureMap() {
  let mapView = window.localStorage.getItem("mapview");
  if (mapView === "undefined" || mapView === undefined) {
    mapView = DEFAULT_STREET_VIEW;
  }
  $(".fa-road").toggleClass("selected");
  if (mapView === SATELLITE_VIEW) {
    $(".fa-satellite").toggleClass("selected");
  } else {
    $(".fa-road").toggleClass("selected");
  }
  loadMapData(getFromLocalStorage(window.localStorage), mapView);
}
export function loadMapData(data, view = DEFAULT_STREET_VIEW) {
  assert(data, "data object not defined");
  let mapObject;

  mapObject = L.map('mapid').setView([data.lat, data.lon], 13);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: view,
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
    timestamp: "900913-m50m",
    api_key: process.env.API_KEY,
    op: "PR0"
  }).addTo(mapObject);
  L.tileLayer('https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={api_key}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    layer: 'precipitation_new',
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
