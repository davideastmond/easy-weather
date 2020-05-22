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
  <div class="weather-card">
    <div class="weather-card-temperature-enclosure">
      <div class="card-temperature">
        <p class="temperature-display">${temperature_high}</p>
      </div>
    </div>
    <div class="weather-card-weather-icon-container">
      <img class="card-icon" src=${icon_src}>
    </div>
    <div class="temperature-display-feels-like-daily">Feels like:${feels_like_high}</div>
    <div class="weather-card-weather-description-container">
      <div class="weather-card-weather-description">${condition_description}</div>
    </div>
    <div class="morning-evening-night-enclosure">
      <p class="daily-temp cat"> Morn | Eve | Night </p>
      <p class="daily-temp"> ${morning_temp} | ${evening_temp} | ${night_temp}</p>
    </div>
    <div>
      <footer class="time-footer">${date_time}</footer>
    </div>
  </div>
`;
