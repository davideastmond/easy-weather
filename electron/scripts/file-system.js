const assert = require("assert");
const path = require("path");
const rootPath = require('electron-root-path').rootPath;
const fs = require('fs');

const MEASUREMENTS = {
  metric: {
    temperature: " °C",
    wind: " km/h",
    pressure: " kPa"
  },
  imperial: {
    temperature: " °F",
    wind: " m/h",
    pressure: " mb"
  }
};

export const TIME_FORMAT_CONVERSION = {
  ["12"]: "h:mm a",
  ["24"]: "HH:mm"
};

export const DEFAULT_BACKGROUND_IMAGE = "background_003_blue_sea_sky.jpg";

/**
 * 
 * @param {{}} storage should be window.localStorage object
 * @returns {string}
 */
export function getFromLocalStorage(storage) {
  assert(storage.getItem, "Incorrect local storage object passed to this method");
  return JSON.parse(storage.getItem("saved_city_data"));
}

/**
 * @returns {string} either "metric" or "imperial"
 */
export function getMeasurementUnitsFromLocalStorage(storage) {
  assert(storage, "storage isn't defined here");
  assert(storage.getItem, "Wrong object passed for obtaining local storage");
  const units = storage.getItem("units");
  if (units && units !== "undefined") {
    return units;
  } else {
    setMeasurementUnitsIntoLocalStorage("metric", storage);
    return "metric";
  }
}

/**
 * @returns { Promise<string[]> } the paths to the built-in photos
 */
export function getPhotoBackgroundResourcePaths(resourcePath = "electron/img/backgrounds") {
  return new Promise((resolve, reject) => {
    const dir_path = path.join(rootPath, getRelevantOSPath(process.platform, resourcePath));
    fs.readdir(dir_path, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

/**
 * Supply a path and os and it will return the correct version with correct slashes
 * @param {string} os 
 * @param {string} pathString 
 */
export function getRelevantOSPath(os, pathString) {
  assert(os && pathString, "provide valid os (win32 || darwin || linux ) and a path string");
  assert(!(pathString.includes("/") && pathString.includes("\\")), "invalid path string");
  assert(os === "win32" || os === "darwin" || os === "linux", `Invalid OS ${os}`);

  // If there are no slashes in the path, return the path itself (no need to modify it)
  if (!(pathString.includes("/")) && !(pathString.includes("\\"))) {
    return pathString;
  }

  let splitPath;
  // Forward slashes for darwin / linux, backslashes for win32
  if (pathString.includes("/")) {
    splitPath = pathString.split("/");
  } else if (pathString.includes("\\")) {
    splitPath = pathString.split("\\");
  }

  switch (os) {
    case "darwin":
      return splitPath.join("/");
    case "linux":
      return splitPath.join("/");
    case "win32":
      return splitPath.join("\\");
  }
}

export function loadBackGroundFromLocalStorage(storage, UILoaderFunction) {
  assert(storage && storage.getItem, "supply a valid local storage object");
  assert(UILoaderFunction, "please supply a UI Loader function that references the UI instance to update");
  const currentImage = storage.getItem("backgroundImage");
  if (currentImage && currentImage !== "undefined") {
    UILoaderFunction(currentImage);
  } else {
    UILoaderFunction(DEFAULT_BACKGROUND_IMAGE);
    storage.setItem("backgroundImage", DEFAULT_BACKGROUND_IMAGE);
  }
}

/**
 * Helper method that allows us to easily get the configuration 
 * info we need to do a fetch
 * request to the weatherAPI
 */
export function getFetchConfigData(storage) {
  const key = process.env.API_KEY;
  const savedCityInfo = getFromLocalStorage(storage);
  const units = getMeasurementUnitsFromLocalStorage(storage);

  return {
    key: key,
    lat: savedCityInfo.lat,
    lon: savedCityInfo.lon,
    units: units
  };
}

/**
 * Saves preferred unit of measurement to localStorage
 * @param {string} unit 
 */
export function setMeasurementUnitsIntoLocalStorage(unit, storage) {
  assert(unit === "metric" || unit === "imperial", "Invalid measurement unit");
  assert(storage && storage.setItem, `Invalid storage object`);
  storage.setItem("units", unit);
}

/**
 * Gets the current measurement units (metric or imperial) and returns the
 * proper unit of measurement given the type
 * @param {string} type "temperature" | "wind" | "pressure"
 */
export function getMeasurementUnitsSymbol(type, storage) {
  const units = getMeasurementUnitsFromLocalStorage(storage);
  return MEASUREMENTS[units][type];
}

/**
 * Returns the appropriate URL based on a weather icon string
 * @param {string} iconString
 * @returns {string} a formatted URL based on weather icon string
 */
export function getWeatherIconURL(iconString) {
  return `http://openweathermap.org/img/wn/${iconString}@2x.png`;
}

export function setTimeFormat(unit, storage) {
  assert(unit === "12" || unit === "24", "invalid time unit. It must be 12 or 24");
  assert(storage && storage.setItem, `Invalid storage object`);
  storage.setItem("timeFormat", unit);
}

/**
 * Retrieves the time format setting from localStorage
 * @param {{}} storage 
 * @returns {string} either "12" or "24" - use this as the key to access the formatString object
 */
export function getTimeFormat(storage) {
  assert(storage && storage.getItem, `Invalid storage object`);
  let format = storage.getItem("timeFormat");

  // if unable to get format, set the default and return default
  if (!format || format === "undefined" || (format !== "12" && format !== "24")) {
    format = "24";
    setTimeFormat(format, storage);
  }
  return format;
}

/**
 * 
 * @param {number} num 
 * @param {number} upper 
 * @param {number} lower (default is 0)
 */
export function numberInRange(num, upper, lower = 0) {
  assert(num && upper, "undefined values");
  assert(upper > lower, "invalid range");
  assert(!isNaN(num), "supply a valid number");
  assert(!isNaN(upper), "supply a valid number(upper)");
  assert(!isNaN(lower), "supply a valid number(lower)");

  return num >= lower && num <= upper;
}
