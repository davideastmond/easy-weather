import {
  getRelevantOSPath,
  getPhotoBackgroundResourcePaths,
  loadBackGroundFromLocalStorage,
  DEFAULT_BACKGROUND_IMAGE,
  getFetchConfigData,
  getWeatherIconURL,
  TIME_FORMAT_CONVERSION,
  getTimeFormat,
  numberInRange,
  setAutoRefreshOption,
  getAutoRefreshOption,
  getTimeZone,
  setTimezoneInfo,
} from "../electron/scripts/file-system";
import regeneratorRuntime from "regenerator-runtime";
import {
  FakeStorage
} from "./utils/fake-storage";



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
      city_name: "testCity",
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
    expect(TIME_FORMAT_CONVERSION["12"]).toBe("h:mm a");
    expect(TIME_FORMAT_CONVERSION["24"]).toBe("HH:mm");
  });

  test("time format conversion from localStorage function", () => {
    const fs = new FakeStorage("timeFormat", "24");
    const fs2 = new FakeStorage("timeFormat", "12");
    expect(TIME_FORMAT_CONVERSION[getTimeFormat(fs)]).toBe("HH:mm");
    expect(TIME_FORMAT_CONVERSION[getTimeFormat(fs2)]).toBe("h:mm a");
  });
  test("gets the time format from localStorage and gets a default value if it's undefined or invalid", () => {
    const fs = new FakeStorage("timeFormat", "12");
    const fs2 = new FakeStorage("timeFormat", "24");
    const fs3 = new FakeStorage("timeFormat", "23");
    const fs4 = new FakeStorage();
    expect(getTimeFormat(fs)).toBe("12");
    expect(getTimeFormat(fs2)).toBe("24");
    expect(getTimeFormat(fs3)).toBe("24");
    expect(getTimeFormat(fs4)).toBe("24");
  });
});

describe("numberInRange tests", () => {
  test("function returns valid result and throws when needed", () => {
    expect(numberInRange(1, 48)).toBe(true);
    expect(numberInRange(10, 50, 11)).toBe(false);
    expect(() => numberInRange("n", 48)).toThrow();
    expect(() => numberInRange(1, 48, 50)).toThrow();
    expect(() => numberInRange(1, "n", 50)).toThrow();
    expect(() => numberInRange(1, 48, "n")).toThrow();
    expect(() => numberInRange(2, 2, 2)).toThrow();
  });
});


describe("auto-refresh option tests", () => {
  test("gets / sets auto-refresh option", () => {
    const fs1 = new FakeStorage();
    setAutoRefreshOption(undefined, fs1);
    expect(fs1.prop.hasOwnProperty('auto_refresh')).toBe(true);
    const result = getAutoRefreshOption(fs1);
    expect(result).toBe(true);
  });

  test("gets correct value if false", () => {
    const fs2 = new FakeStorage();
    setAutoRefreshOption(false, fs2);
    const getResult = getAutoRefreshOption(fs2);
    expect(getResult).toBe(false);
  });
});

describe("get time zone tests", () => {
  test("gets timezone string", () => {
    const fs = new FakeStorage();
    fs.saveObject("timezone", {
      city_name: "testCity",
      lat: "123",
      lon: "456",
      timezone: "America/Toronto",
      timezone_offset: 3600
    });

    const result = getTimeZone(fs);
    expect(result.timezone).toBe("America/Toronto");
    expect(result.timezone_offset).toBeDefined();
  });

  test("sets timezone string in local storage", () => {
    const input = {
      timezone: "foo",
      timezone_offset: 999
    };
    const fs = new FakeStorage();
    setTimezoneInfo(input, fs);

    const result = JSON.parse(fs.getItem("timezone"));
    expect(result.timezone).toBe(input.timezone);
    expect(result.timezone_offset).toBe(input.timezone_offset);
  });
});
