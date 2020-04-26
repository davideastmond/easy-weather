import { getMeasurementUnitsFromLocalStorage } from "../electron/scripts/measurement-units";
import { getFromLocalStorage } from "../electron/scripts/weather-functions";

describe("local storage tests", () => {
  test("should return the correct unit of measurements when retrieving from local storage", ()=> {
    // using a mock local storage object
    const localStorageObj = {
      getItem: (key) => {
        return localStorageObj[key];
      },
      units: "imperial"
    }
    expect(getMeasurementUnitsFromLocalStorage(localStorageObj)).toBe("imperial");

    const anotherStorageObject = {
      getItem: (key) => {
        return anotherStorageObject[key];
      }
    }
    expect(getMeasurementUnitsFromLocalStorage(anotherStorageObject)).toBe("metric");
  });

  test("gets city info from local storage", ()=> {
    let localStorageObj = {
      getItem: (key) => {
        return localStorageObj[key];
      },
      saved_city_data: {
        city_name: "Toronto"
      }
    }
    
    localStorageObj.saved_city_data = JSON.stringify(localStorageObj.saved_city_data);
    const result = getFromLocalStorage(localStorageObj);
    expect(result.city_name).toBe("Toronto");
  })
})