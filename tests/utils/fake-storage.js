export class FakeStorage {
  constructor(key, val) {
   this.prop = {
     [key]: val
   };
  }

  getItem(key) {
    return this.prop[key];
  }
}