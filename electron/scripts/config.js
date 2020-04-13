window.$ = window.jQuery = require("jquery");
const cityList = require("../public/data/city.list.json");
let selectedCityInformation;

$(()=> {
  // Do live search results when user types in a city, stroke by stroke
  $(".city-search-box").keyup(()=> {
    const textLength = $(".city-search-box").val().length;
    const textValue = $(".city-search-box").val();
    if (textLength >= 1) {
      renderCitySearchResults(doCityFilter(textValue));
    }
  });

  // User clicks on a city result in the list
  $(".city-results-list").click((e)=> {
    setSelectedCityInformation(e);
    console.log(selectedCityInformation);
    $(".save-button").prop("disabled", false);
    $(".city-item").removeClass("city-selected");
    $(e.target).addClass("city-selected");
  });

  $(".save-button").click((e) => {
    // Save city information to localStorage. Disable the save button and navigate to the
    try { 
      window.localStorage.setItem("saved_city_data", JSON.stringify(selectedCityInformation));
      $(".saved-button").prop("disabled", true);
      window.location.href = "current-forecast.html";
    } catch(ex) {
      alert(ex);
    }
    // navigate to current-forecast page.
  });
});

/**
 * Basically populates the global object. This called when user selects
 * a city from the search result.
 * @param {object} e 
 */
function setSelectedCityInformation(e) {
  selectedCityInformation = {
    id: e.target.dataset.id,
    city_name: e.target.dataset.city_name,
    state: e.target.dataset.state,
    country: e.target.dataset.country,
    lat: e.target.dataset.lat,
    lon: e.target.dataset.lon,
    full_name: ()=> {
      return `${selectedCityInformation.city_name}, ${selectedCityInformation.state} ${selectedCityInformation.country}`.trim();
    }
  };
  $(".selected-city-label").text(selectedCityInformation.full_name());
}
/**
 * This function will return list items based on the search
 */
function renderCitySearchResults(filteredCityList) {
  if (filteredCityList.length <= 250) {
    $(".city-results-list").empty();
    filteredCityList.forEach((item) => {
      $(".city-results-list").append(getListItem(item));
    });
  }
}

/**
 * This function will perform the city list filter (returning an array of city objects)
 * @returns {[]} An array of filtered city items from city.list.json
 */
function doCityFilter(input) {
  return cityList.filter((cityItem) => {
    return cityItem.name.toLowerCase().startsWith(input.toLowerCase()) || cityItem.name.toLowerCase().includes(input.toLowerCase());
  }).map((result) => {
    return { id: result.id, 
      cityName: result.name, 
      state: result.state.trim(), 
      country: getFullCountryFromISOCode(result.country),
      lat: result.coord.lat,
      lon: result.coord.lon
    };
  });
}

/**
 * Creates and returns an individual list-item
 * @returns {jQueryDOMElement} A jQuery DOM element
 */
function getListItem(cityListItem) {
  return $("<li></li>").addClass("list-group-item city-item")
  .text(`${cityListItem.cityName}, ${cityListItem.state} ${cityListItem.country}`)
  .attr("data-id", cityListItem.id)
  .attr("data-city_name", `${cityListItem.cityName}`)
  .attr("data-state", `${cityListItem.state}`)
  .attr("data-country", `${cityListItem.country}`)
  .attr("data-lat",`${cityListItem.lat}`)
  .attr("data-lon", `${cityListItem.lon}`);
}

/**
 * 
 * @param {string} ISOCode 
 * @returns {string} Friendly country name
 */
function getFullCountryFromISOCode(ISOCode) {
  const codes = require("../public/data/country-codes.json");

  const results = codes.filter(code => code["alpha-2"] === ISOCode);
  if (results && results.length > 0) {
    return results[0].name;
  }
  return "Country name not found";
}

function getCityDataById(id) {
  // Will return a single object from the city.list.json
  return cityList.filter((city) => city.id === id);
}