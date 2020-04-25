import { getWindCompassDirectionFromDegrees, getWindSpeed } from "../electron/scripts/weather-functions.js";

describe("Conversion tests", ()=> {
  test("converts wind direction in degrees to compass coordinates (90 degrees)", ()=> {
    const result = getWindCompassDirectionFromDegrees(90);
    expect(result).toBe("E");
  });

  test("converts wind direction in degrees to compass coordinates (0 degrees)", ()=> {
    const result = getWindCompassDirectionFromDegrees(0);
    expect(result).toBe("N");
  });

  test("calculates correct wind speed, converting from m/s to km/h", ()=> {
    const speedValue = 30;
    const result = getWindSpeed(speedValue, "metric");
    expect(result).toBe(Math.ceil(108));
  });

  test("calculates correct wind speed, imperial", ()=> {
    const speedValue = 30;
    const result = getWindSpeed(speedValue, "imperial");
    expect(result).toBe(30);
  });
});