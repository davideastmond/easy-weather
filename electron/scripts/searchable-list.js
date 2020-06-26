import {
  removeDiacritics
} from "./diacritics.js";

export function loadSearchableList(cityList) {
  const returnList = cityList.map((element) => {
    return {
      ...element,
      name: removeDiacritics(element.name),
      original_name: element.name,
    };
  });
  return returnList;
}
