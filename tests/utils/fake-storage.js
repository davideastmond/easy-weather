export class FakeStorage {
  constructor(key, val) {
   this.prop = {
     [key]: val
   };
  }

  getItem(key) {
    return this.prop[key];
  }

  saveObject(key, val) {
    this.prop = {
      [key]: JSON.stringify(val)
    };
  }
}