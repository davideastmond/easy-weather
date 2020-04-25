import { getForecastFromAPI } from "../electron/scripts/weather-functions";
import regeneratorRuntime from "regenerator-runtime";
require("dotenv").config();

test("API returns valid response code (200)", async() => {
  const lat = 43.683411;
  const lon = -79.766327;
  const key = process.env.API_KEY;
  const units = "metric";
  const response = await getForecastFromAPI(lat, lon, key, units);
  expect(response.status).toBe(200);
});