const assert = require('assert');
const MEASUREMENTS = {
  metric: { temperature: " °C", wind: " km/h", pressure: " kPa"},
  imperial:{ temperature: " °F", wind: " m/h", pressure: " mb"}
};
/**
 * Saves preferred unit of measurement to localStorage
 * @param {string} unit 
 */
export function setMeasurementUnitsIntoLocalStorage(unit) {
  assert(unit === "metric" || unit === "imperial", "Invalid measurement unit");
  window.localStorage.setItem("units", unit);
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
    setMeasurementUnitsIntoLocalStorage("metric");
    return "metric";
  }
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