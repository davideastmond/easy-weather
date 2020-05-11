import { getForecastFromAPI } from "../electron/scripts/weather-functions";
import regeneratorRuntime from "regenerator-runtime";
require("dotenv").config();

describe.only("External API tests", ()=> {
  test.only("API returns valid response code (200)", async() => {
    const lat = 43.683411;
    const lon = -79.766327;
    const key = process.env.API_KEY;
    const units = "metric";
    const response = await getForecastFromAPI(lat, lon, key, units);
    expect(response.status).toBe(200);
    expect(response).toHaveProperty("data.hourly");
    expect(response).toHaveProperty("data.current");
    expect(response).toHaveProperty("data.daily");
    expect(response).toHaveProperty("data.minutely");
    expect(response.data.timezone).toBe("America/Toronto");
    expect(response.data.hourly).toHaveLength(48);
  });
});