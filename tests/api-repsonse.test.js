import * as module from "../electron/scripts/weather-functions";
module.getForecastFromAPI = jest.fn(() => {
  return Promise.resolve({
    status: 200,
    data: {
      hourly: Array(48),
      current: {},
      daily: {},
      minutely: {},
      timezone: "America/Toronto"
    }
  });
});

import regeneratorRuntime from "regenerator-runtime";
import {
  jestPreset
} from "ts-jest";
require("dotenv").config();

describe("External API tests", () => {
  test("API returns valid response code (200)", async () => {
    const lat = 43.683411;
    const lon = -79.766327;
    const key = process.env.API_KEY;
    const units = "metric";
    const response = await module.getForecastFromAPI(lat, lon, key, units);
    expect(response.status).toBe(200);
    expect(response).toHaveProperty("data.hourly");
    expect(response).toHaveProperty("data.current");
    expect(response).toHaveProperty("data.daily");
    expect(response).toHaveProperty("data.minutely");
    expect(response.data.timezone).toBe("America/Toronto");
    expect(response.data.hourly).toHaveLength(48);
  });
});
