import regeneratorRuntime from "regenerator-runtime";
const axios = require("axios");
import {
  getForecastFromAPI
} from "../electron/scripts/weather-functions";

jest.mock("axios");

describe("API test", () => {
  test("gets a resolution from API fetch", async () => {
    const info = [{
      city: "test"
    }];
    const resp = {
      data: info
    };

    axios.get.mockResolvedValue(resp);
    const result = await getForecastFromAPI(43.683411, -79.766327, process.env.API_KEY, "metric");
    expect(result.data).toEqual(info);
  });
});
