window.$ = window.jQuery = require("jquery");

/**
 * We should access localStorage to see if there are any settings. If so
 * redirect to more content-relevant page. Otherwise prompt for settings
 */ 

$(()=> {
  window.localStorage.clear();
  const data = window.localStorage.getItem("saved_city_data");
  if (!data || data === "") {
    window.location.href = "config.html";
  } else {
    // Load the city data and do a fetch request to the API
    window.location.href = "current-forecast.html";
  }
});