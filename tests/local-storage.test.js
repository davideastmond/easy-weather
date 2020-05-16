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
    expect(getMeasurementUnitsFromLocalStorage(fs1)).toBe("imperial");
    expect(getMeasurementUnitsFromLocalStorage(fs2)).toBe("metric");
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
});