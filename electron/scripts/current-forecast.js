
import { getForecastFromAPI,
  updateWeatherForecastUI } from "./weather-functions.js";

$(async()=> {
  /* When this page loads, we need to do an axios fetch request to the API
  to get weather for the city. Then call a method to update the UI
  */
  try {
    const { data } = await getForecastFromAPI();
    updateWeatherForecastUI(data);
  } catch (ex) {
    alert(ex);
  }
});