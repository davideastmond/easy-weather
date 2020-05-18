import {
  FakeStorage
} from "./utils/fake-storage";

describe("Fake storage test functionality", () => {
  test("fake storage object returns correct value", () => {
    const fakeStorage = new FakeStorage("foo", "bar");
    const result = fakeStorage.getItem("foo");
    expect(result).toBe("bar");
  });

  test("fake storage object returns undefined due to invalid key", () => {
    const fakeStorage = new FakeStorage("foo", "bar");
    const result = fakeStorage.getItem("other");
    expect(result).toBe(undefined);
  });

  test("fake storage object sets the correct key value (where value is a string) and it can be retrieved", () => {
    const fakeStorage = new FakeStorage();
    fakeStorage.setItem("foo", "bar");
    expect(fakeStorage.getItem("foo")).toBe("bar");
  });

  test("fake storage object sets key value but value is an object", () => {
    const fakeStorage = new FakeStorage();
    const testItem = {
      key: "value",
      more_keys: "keys"
    };
    fakeStorage.setItem("foo", testItem);
    expect(fakeStorage.getItem("foo")).toMatchObject(testItem);
    expect(fakeStorage.getItem("foo")).toMatchObject({
      more_keys: "keys",
      key: "value"
    });
  });
});
