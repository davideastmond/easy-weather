import { getMeasurementUnitsFromLocalStorage } from "../electron/scripts/measurement-units";
import { getFromLocalStorage } from "../electron/scripts/weather-functions";
import { FakeStorage } from "./utils/fake-storage";

describe("local storage tests", () => {
  test("should return the correct unit of measurements when retrieving from local storage", ()=> {
    const fs1 = new FakeStorage("units", "imperial");
    const fs2 = new FakeStorage("units", "metric");
    expect(getMeasurementUnitsFromLocalStorage(fs1)).toBe("imperial");
    expect(getMeasurementUnitsFromLocalStorage(fs2)).toBe("metric");
  });

  test("gets city info from local storage", ()=> {
    const fs1 = new FakeStorage();
    fs1.saveObject("saved_city_data", { city_name: "Toronto"});
    const result = getFromLocalStorage(fs1);
    expect(result.city_name).toBe("Toronto");
  });

  test("invalid key supplied", ()=> {
    const fs1 = new FakeStorage();
    fs1.saveObject("saved_city_data", { city_name: "Toronto"});
    const result = getFromLocalStorage(fs1);
    expect(result.invalid).toBe(undefined);
  });

});