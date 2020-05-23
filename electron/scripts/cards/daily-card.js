/**
 * Separate card for daily forecast because data is different from API
 */
export const dailyCard = ({
  temperature_high,
  feels_like_high,
  morning_temp,
  evening_temp,
  night_temp,
  condition_main,
  condition_description,
  wind_speed,
  wind_direction,
  date_time,
  icon_src
}) => `
  <div class="weather-card card-shadow">
    <div class="weather-card-temperature-enclosure">
      <div class="card-temperature">
        <p class="temperature-display shadow-text">${temperature_high}</p>
      </div>
    </div>
    <div class="weather-card-weather-icon-container">
      <img class="card-icon" src=${icon_src}>
    </div>
    <div class="temperature-display-feels-like-daily">Feels: ${feels_like_high}</div>
    <div class="weather-card-weather-description-container">
      <div class="weather-card-weather-description-daily shadow-text">${condition_description}</div>
    </div>
    <div class="morning-evening-night-enclosure">
      <p class="daily-temp cat"> Morn | Eve | Night </p>
      <p class="daily-temp shadow-text"> ${morning_temp} | ${evening_temp} | ${night_temp}</p>
    </div>
    <div class="wind-daily-enclosure"> 
      <p class="wind-data">${wind_speed} ${wind_direction}</p>
    </div>
    <div class="time-footer-enclosure">
      <footer class="daily-time-footer">${date_time}</footer>
    </div>
  </div>
`;
