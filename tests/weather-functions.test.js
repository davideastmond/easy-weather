import {
  updateWeatherForecastUI
} from "../electron/scripts/weather-functions.js";

import {
  FakeStorage
} from "./utils/fake-storage.js";

import {
  setTimezoneInfo
} from "../electron/scripts/file-system.js";

const apiData = require("../electron/public/data/sample-api-data.json");

describe.only("updateWeatherForecastUI tests", () => {
  test("UI Updates", () => {

    const $ = require("jquery");
    const fs = new FakeStorage();
    fs.saveObject("saved_city_data", {
      city_name: "testCity",
      lat: "123",
      lon: "456",
      timezone: "America/Toronto",
      timezone_offset: 3600
    });
    setTimezoneInfo({
      timezone: "America/Toronto",
      timezone_offset: 3600
    }, fs);


    document.body.innerHTML =
      '<div class="city-name">' +
      '</div>' +
      '<div class="current-conditions-icon"' +
      '</div>' +
      '<div class="wind-gust"</div>';
    updateWeatherForecastUI(apiData, fs);
    const cityText = $(".city-name").text();
    const gustText = $(".wind-gust").text();
    expect(gustText).toBe("Gust: -");
    expect(cityText).toBe("testCity");
  });
});
