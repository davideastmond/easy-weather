window.$ = window.jQuery = require("jquery");
const cityList = require("../public/data/city.list.json");
const assert = require("assert");
const electronPath = require("electron-root-path").rootPath;
const path = require("path");
import { getPhotoBackgroundResourcePaths } from "./file-system.js";
import { setMeasurementUnitsIntoLocalStorage, getMeasurementUnitsFromLocalStorage } from "./measurement-units.js";


let selectedCityInformation;
let isWin = process.platform === "win32"

$(()=> {
  // Do dynamic search results when user types in a city, stroke by stroke
  $(".city-search-box").keyup(()=> {
    const textLength = $(".city-search-box").val().length;
    const textValue = $(".city-search-box").val();
    if (textLength >= 1) {
      renderCitySearchResults(doCityFilter(textValue));
    }
  });

  // User clicks on a city result in the list
  $(".city-results-list").click((e)=> {
    setSelectedCityInformation(e);
    console.log(selectedCityInformation);
    $(".save-button").prop("disabled", false);
    $(".city-item").removeClass("city-selected");
    $(e.target).addClass("city-selected");
  });

  $(".save-button").click((e) => {
    // Save city information to localStorage. Disable the save button and navigate to the weather page
    try { 
      window.localStorage.setItem("saved_city_data", JSON.stringify(selectedCityInformation));
      $(".saved-button").prop("disabled", true);
      window.location.href = "current-forecast.html";
    } catch(ex) {
      alert(ex);
    }
  });

  $(".options-change-background-image-enclosure").click((e)=>{
    window.localStorage.setItem("backgroundImage", e.target.dataset.id);
    liveLoadBackgroundImage(e.target.dataset.id);
    refreshImages();
    $(e.target).toggleClass("active-background-image-selected");
  });

  $(".metric").click((e) => {
    if (! $(e.target).hasClass("active")) {
      $(e.target).addClass("active");
      $(".imperial").removeClass("active");
      setMeasurementUnitsIntoLocalStorage("metric");
    }
  });

  $(".imperial").click((e)=> {
    if (! $(e.target).hasClass("active")) {
      $(e.target).addClass("active");
      $(".metric").removeClass("active");
      setMeasurementUnitsIntoLocalStorage("imperial");
    }
  });
  loadDefaultMeasurementUnits();
  refreshBackgroundImageThumbnails();
});

function liveLoadBackgroundImage(fileName) {
  console.log(fileName)
  const fn = `../img/backgrounds/${fileName}`;
  console.log("71", fn);
  $(".configuration-window").css("background-image", "url(" + fn + ")");
}

function loadBackGroundFromLocalStorage() {
  const currentImage = window.localStorage.getItem("backgroundImage");

  if (currentImage !== "undefined" && currentImage !== null) {
    liveLoadBackgroundImage(currentImage);
  } else {
    loadDefaultBackground();
  }
}

function loadDefaultBackground() {
  liveLoadBackgroundImage("background_003_blue_sea_sky.jpg");
  window.localStorage.setItem("backgroundImage", "background_003_blue_sea_sky.jpg" );
}
/**
 * Basically populates the global object. This called when user selects
 * a city from the search result.
 * @param {object} e 
 */
function setSelectedCityInformation(e) {
  selectedCityInformation = {
    id: e.target.dataset.id,
    city_name: e.target.dataset.city_name,
    state: e.target.dataset.state,
    country: e.target.dataset.country,
    lat: e.target.dataset.lat,
    lon: e.target.dataset.lon,
    full_name: ()=> {
      return `${selectedCityInformation.city_name}, ${selectedCityInformation.state} ${selectedCityInformation.country}`.trim();
    }
  };
  $(".selected-city-label").text(selectedCityInformation.full_name());
}

/**
 * This function will return list items based on the search
 */
function renderCitySearchResults(filteredCityList) {
  if (filteredCityList.length <= 250) {
    $(".city-results-list").empty();
    filteredCityList.forEach((item) => {
      $(".city-results-list").append(getListItem(item));
    });
  }
}

/**
 * This function will perform the city list filter (returning an array of city objects)
 * @returns {[{}]} An array of filtered city items from city.list.json
 */
function doCityFilter(input) {
  return cityList.filter((cityItem) => {
    return cityItem.name.toLowerCase().startsWith(input.toLowerCase()) || cityItem.name.toLowerCase().includes(input.toLowerCase());
  }).map((result) => {
    return { id: result.id, 
      cityName: result.name, 
      state: result.state.trim(), 
      country: getFullCountryFromISOCode(result.country),
      lat: result.coord.lat,
      lon: result.coord.lon
    };
  });
}

/**
 * Creates and returns an individual list-item
 * @returns {JQuery<HTMLElement>} A jQuery DOM element
 */
function getListItem(cityListItem) {
  return $("<li></li>").addClass("list-group-item city-item")
  .text(`${cityListItem.cityName}, ${cityListItem.state} ${cityListItem.country}`)
  .attr("data-id", cityListItem.id)
  .attr("data-city_name", `${cityListItem.cityName}`)
  .attr("data-state", `${cityListItem.state}`)
  .attr("data-country", `${cityListItem.country}`)
  .attr("data-lat",`${cityListItem.lat}`)
  .attr("data-lon", `${cityListItem.lon}`);
}

/**
 * Updates the small thumbnails of default-built-in 
 * background images user can select
 * as main background image
 * @param {number} max 
 */
async function refreshBackgroundImageThumbnails(max = 6) {
  // This gets all the paths regardless of amount
  loadBackGroundFromLocalStorage();
  let backgroundImageElementURLS = await getPhotoBackgroundResourcePaths();
  if (backgroundImageElementURLS.length > max) {
    backgroundImageElementURLS = backgroundImageElementURLS.slice(0, max + 1);
  }
  backgroundImageElementURLS.forEach((url) => {
    if (!isWin) {
      $(".options-change-background-image-enclosure")
      .append(getBackGroundImageFromResource(path.join(electronPath, "electron/img/backgrounds/" + url), url)); 
    } else {
      $(".options-change-background-image-enclosure")
      .append(getBackGroundImageFromResource(path.join(electronPath, "electron\\img\\backgrounds\\" + url), url)); 
    }
  });
}

/**
 * Returns a jQuery image element based on the URL
 * @param {JQuery<HTMLElement>} resource 
 */
function getBackGroundImageFromResource(resource, fn) {
  assert(resource, "Image URL is null or undefined");
  const currentImage = window.localStorage.getItem("backgroundImage");

  if (currentImage === fn) {
    return $("<img/>").addClass("options-bkg-img-thumbnail")
    .attr("src", resource)
    .attr("data-id", fn)
    .addClass("active-background-image-selected");
  }
  return $("<img/>").addClass("options-bkg-img-thumbnail")
  .attr("src", resource)
  .attr("data-id", fn);   
}

/** 
 * @param {string} ISOCode 
 * @returns {string} Friendly country name
 */
function getFullCountryFromISOCode(ISOCode) {
  const codes = require("../public/data/country-codes.json");
  const results = codes.filter(code => code["alpha-2"] === ISOCode);

  if (results && results.length > 0) {
    return results[0].name;
  }
  return "Country name not found";
}

function refreshImages() {
  $(".options-bkg-img-thumbnail").removeClass("active-background-image-selected");
}

function loadDefaultMeasurementUnits() {
  const units = getMeasurementUnitsFromLocalStorage();
  // update UI
  $(".metric").removeClass("active");
  $(".imperial").removeClass("active");
  switch(units) {
    case "metric":
      $(".metric").addClass("active");
      break;
    case "imperial":
      $(".imperial").addClass("active");
      break;
  }
}