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
  const units = window.sessionStorage.getItem("units");

  if (units && units !== "undefined") {
    return units;
  } else {
    console.log("Measurement units was undefined: reset to metric");
    setMeasurementUnitsIntoLocalStorage("metric");
    return "metric";
  }
}