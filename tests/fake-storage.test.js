import { FakeStorage } from "./utils/fake-storage";

describe("Fake storage test functionality", ()=> {
  test("fake storage object returns correct value", ()=> {
    const fakeStorage = new FakeStorage("foo", "bar");
    const result = fakeStorage.getItem("foo");
    expect(result).toBe("bar");
  });
  test("fake storage object returns undefined due to invalid key", ()=> {
    const fakeStorage = new FakeStorage("foo", "bar");
    const result = fakeStorage.getItem("other");
    expect(result).toBe(undefined);
  }); 
});