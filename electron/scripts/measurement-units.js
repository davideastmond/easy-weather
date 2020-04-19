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
  const storage = window.localStorage;
  storage.setItem("units", unit);
}

/**
 * @returns {string} either "metric" or "imperial"
 */
export function getMeasurementUnitsFromLocalStorage () {
  const units = window.localStorage.getItem("units");
  console.log("L-21 Units was", units);
  if (units && units !== "undefined") {
    return units;
  } else {
    console.log("Measurement units was undefined: reset to metric");
    setMeasurementUnitsIntoLocalStorage("metric");
    return "metric";
  }
}

/**
 * Gets the current measurement units (metric or imperial) and returns the
 * proper unit of measurement given the type
 * @param {string} type "temperature" | "wind" | "pressure"
 */
export function getMeasurementUnitsSymbol(type) {
  const units = getMeasurementUnitsFromLocalStorage();
  return MEASUREMENTS[units][type];
}