import {
  getMeasurementUnitsFromLocalStorage,
  setMeasurementUnitsIntoLocalStorage
} from "../electron/scripts/file-system";
import {
  getFromLocalStorage
} from "../electron/scripts/file-system";
import {
  FakeStorage
} from "./utils/fake-storage";

describe("local storage tests", () => {
  test("should return the correct unit of measurements when retrieving from local storage", () => {
    const fs1 = new FakeStorage("units", "imperial");
    const fs2 = new FakeStorage("units", "metric");
    const fs3 = new FakeStorage("units", undefined);
    expect(getMeasurementUnitsFromLocalStorage(fs1)).toBe("imperial");
    expect(getMeasurementUnitsFromLocalStorage(fs2)).toBe("metric");
    expect(getMeasurementUnitsFromLocalStorage(fs3)).toBe("metric");
  });

  test("gets city info from local storage", () => {
    const fs1 = new FakeStorage();
    fs1.saveObject("saved_city_data", {
      city_name: "Toronto"
    });
    const result = getFromLocalStorage(fs1);
    expect(result.city_name).toBe("Toronto");
  });

  test("invalid key supplied", () => {
    const fs1 = new FakeStorage();
    fs1.saveObject("saved_city_data", {
      city_name: "Toronto"
    });
    const result = getFromLocalStorage(fs1);
    expect(result.invalid).toBe(undefined);
  });

  test("measurement units properly set / retrieved into / from localStorage object", () => {
    const fs1 = new FakeStorage();
    const fs2 = new FakeStorage();
    setMeasurementUnitsIntoLocalStorage("metric", fs1);
    setMeasurementUnitsIntoLocalStorage("imperial", fs2);
    expect(fs1.getItem("units")).toBe("metric");
    expect(fs2.getItem("units")).toBe("imperial");

  });

  test("gets lat and long data from saved_city_data", () => {
    const fs1 = new FakeStorage();
    fs1.saveObject("saved_city_data", {
      city_name: "London",
      lat: 51.51,
      long: -0.09
    });

    const result = getFromLocalStorage(fs1);
    expect(result.lat).toBe(51.51);
    expect(result.long).toBe(-0.09);
  });
});
