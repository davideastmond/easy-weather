import { getMeasurementUnitsFromLocalStorage } from "../electron/scripts/measurement-units";
import { getFromLocalStorage } from "../electron/scripts/weather-functions";
import { FakeStorage } from "./utils/fake-storage";

describe("local storage tests", () => {
  test.only("should return the correct unit of measurements when retrieving from local storage", ()=> {
    const fs1 = new FakeStorage("units", "imperial");
    const fs2 = new FakeStorage("units", "metric");
    expect(getMeasurementUnitsFromLocalStorage(fs1)).toBe("imperial");
    expect(getMeasurementUnitsFromLocalStorage(fs2)).toBe("metric");
  });

  test.only("gets city info from local storage", ()=> {
    let localStorageObj = {
      getItem: (key) => {
        return localStorageObj[key];
      },
      saved_city_data: {
        city_name: "Toronto"
      }
    };
    
    localStorageObj.saved_city_data = JSON.stringify(localStorageObj.saved_city_data);
    const result = getFromLocalStorage(localStorageObj);
    expect(result.city_name).toBe("Toronto");
  });
});