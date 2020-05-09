/**
 * This class simulats basic localStorage functionality, allowing users to set
 * dynamic key values and retrieve them as long as the object is in scope
 */
export class FakeStorage {
  constructor(key, val) {
   this.prop = {
     [key]: val
   };
  }

  getItem(key) {
    return this.prop[key];
  }

  setItem(key, val) {
    this.prop = {
      [key]: val
    };
  }

  saveObject(key, val) {
    this.prop = {
      [key]: JSON.stringify(val)
    };
  }
}