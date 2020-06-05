import {
  removeDiacritics
} from "../electron/scripts/diacritics.js";


describe("remove diacritics", () => {
  test("removes diacritics properly", () => {
    const input = ["Mayagüez", "Río Piedras", "Utqiaġvik", "Québec"];
    const expectedOutput = ["Mayaguez", "Rio Piedras", "Utqiagvik", "Quebec"];
    const result = input.map((element) => removeDiacritics(element));
    expect(result).toEqual(expectedOutput);
  });
});
