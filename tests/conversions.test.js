import {
  getWindCompassDirectionFromDegrees,
  getWindSpeed,
  makeWeatherConditionCaptionString
} from "../electron/scripts/weather-functions.js";

import {
  getMeasurementUnitsSymbol
} from "../electron/scripts/file-system.js";
import {
  FakeStorage
} from "./utils/fake-storage.js";


describe("Conversion tests", () => {
  test("converts wind direction in degrees to compass coordinates (90 degrees)", () => {
    const result = getWindCompassDirectionFromDegrees(90);
    expect(result).toBe("E");
  });

  test("converts wind direction in degrees to compass coordinates (0 degrees)", () => {
    const result = getWindCompassDirectionFromDegrees(0);
    expect(result).toBe("N");
  });

  test("calculates correct wind speed, converting from m/s to km/h", () => {
    const speedValue = 30;
    const result = getWindSpeed(speedValue, "metric");
    expect(result).toBe(Math.ceil(108));
  });

  test("calculates correct wind speed, imperial", () => {
    const speedValue = 30;
    const result = getWindSpeed(speedValue, "imperial");
    expect(result).toBe(30);
  });

  test("makes a proper weather condition caption string", () => {
    const testString = [{
      main: "testing"
    }, {
      main: "one"
    }, {
      main: "two"
    }];
    const result = makeWeatherConditionCaptionString(testString);
    expect(result).toBe("testing one two");
  });

  test("returns correct measurement units symbol for metric measurement system", () => {
    const fs = new FakeStorage("units", "metric");
    expect(getMeasurementUnitsSymbol("temperature", fs)).toBe(" °C");
    expect(getMeasurementUnitsSymbol("wind", fs)).toBe(" km/h");
    expect(getMeasurementUnitsSymbol("pressure", fs)).toBe(" kPa");
  });

  test("returns correct measurement units symbol for imperial measurement system", () => {
    const fs = new FakeStorage("units", "imperial");
    expect(getMeasurementUnitsSymbol("temperature", fs)).toBe(" °F");
    expect(getMeasurementUnitsSymbol("wind", fs)).toBe(" m/h");
    expect(getMeasurementUnitsSymbol("pressure", fs)).toBe(" mb");
  });
});
