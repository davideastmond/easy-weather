import {
  getRelevantOSPath,
  getPhotoBackgroundResourcePaths,
  loadBackGroundFromLocalStorage,
  DEFAULT_BACKGROUND_IMAGE,
  getFetchConfigData,
  getWeatherIconURL,
  TIME_FORMAT_CONVERSION
} from "../electron/scripts/file-system";
import regeneratorRuntime from "regenerator-runtime";
import {
  FakeStorage
} from "./utils/fake-storage";
import moment from "moment";

describe("file system tests", () => {
  test("returns the correctly-formatted path for win32", () => {
    const os = "win32";
    const path = "/test/test.path";
    const result = getRelevantOSPath(os, path);
    expect(result).toBe("\\test\\test.path");
  });

  test("returns correctly-formatted path for darwin", () => {
    const os = "darwin";
    const path = "\\test\\test.path";
    const result = getRelevantOSPath(os, path);
    expect(result).toBe("/test/test.path");
  });

  test("already valid win32 path - should return same valid win32 path", () => {
    const os = "win32";
    const path = "\\test\\test.path";
    const result = getRelevantOSPath(os, path);
    expect(result).toBe(path);
  });

  test("already valid darwin path - should return same valid darwin path", () => {
    const os = "darwin";
    const path = "/test/test.path";
    const result = getRelevantOSPath(os, path);
    expect(result).toBe(path);
  });

  test("invalid os - should throw", () => {
    const os = "solaris"; // sorry Solaris fans :(
    const path = "\\test\\test.path";
    expect(() => getRelevantOSPath(os, path)).toThrow();
  });

  test("Invalid path formatting, should throw", () => {
    const os = "darwin";
    const path = "\/test\\test.path";
    expect(() => getRelevantOSPath(os, path)).toThrow();
  });

  test("path string has no slashes - just return original path string with no formatting", () => {
    const os = "win32";
    const path = "my_path";
    const result = getRelevantOSPath(os, path);
    expect(result).toBe(path);
  });

  test("photoResourcePaths return valid data and throws / rejects as expected", async () => {
    await expect(getPhotoBackgroundResourcePaths()).resolves.not.toHaveLength(0);
    await expect(getPhotoBackgroundResourcePaths("/invalid/path")).rejects;
  });
});

describe("loadBackGroundFromLocalStorage", () => {
  test("loadBackGroundFromLocalStorage throws with undefined parameters", () => {
    const fs1 = new FakeStorage();
    expect(() => loadBackGroundFromLocalStorage()).toThrow();
  });
  test("loads / sets the default image from storage if backgroundImage property is not defined", () => {
    const fs = new FakeStorage("backgroundImage", undefined);
    loadBackGroundFromLocalStorage(fs, function () {});
    expect(fs.getItem("backgroundImage")).toBe(DEFAULT_BACKGROUND_IMAGE);
  });
});

describe("getFetchConfigData", () => {
  test("getFetchConfigData - returns correct values from localStorage", () => {
    const fs = new FakeStorage();
    fs.saveObject("saved_city_data", {
      lat: "123",
      lon: "456",
    });
    fs.setItem("units", "imperial");
    let lat, lon, units;
    ({
      lat,
      lon,
      units
    } = getFetchConfigData(fs));
    expect(lat).toBe("123");
    expect(lon).toBe("456");
    expect(units).toBe("imperial");
  });
});

describe("getWeatherIconURL function", () => {
  test("getWeatherIconURL returns correctly formatted URL", () => {
    const iconString = "test";
    expect(getWeatherIconURL(iconString)).toBe(`http://openweathermap.org/img/wn/${iconString}@2x.png`);
  });
});

describe("time format conversion tests", () => {
  test("returns correct time format string for use with moment.js", () => {
    expect(TIME_FORMAT_CONVERSION["12"]).toBe("hh:mm a");
    expect(TIME_FORMAT_CONVERSION["24"]).toBe("HH:mm");
  });
});