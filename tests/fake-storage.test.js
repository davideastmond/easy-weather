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

  test("fake storage object sets the correct key value (where value is a string) and it can be retrieved", ()=> {
    const fakeStorage = new FakeStorage();
    // create a new key value (string) on the fly and then test that it can be retrieved
    fakeStorage.setItem("foo", "bar"); 
    expect(fakeStorage.getItem("foo")).toBe("bar");
  });

  test.only("fake storage object sets key value but value is an object", () => {
    const fakeStorage = new FakeStorage();
    fakeStorage.setItem("foo", { key: "value"});
    expect(fakeStorage.getItem("foo")).toBe("value");
  });
});