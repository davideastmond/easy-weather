/**
 * A template for hourly forecast cards.
 */
export const weatherCard = ({
  temperature,
  feels_like,
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
        <p class="temperature-display shadow-text">${temperature}</p>
      </div>
    </div>
    <div class="weather-card-weather-icon-container">
      <img class="card-icon" src=${icon_src}>
    </div>
    <div class="temperature-display-feels-like">Feels like:${feels_like}</div>
    <div class="weather-card-weather-description-container">
      <div class="weather-card-weather-description shadow-text">${condition_description}</div>
    </div>
    <div class="time-footer-enclosure">
      <footer class="time-footer">${date_time}</footer>
    </div>
  </div>
`;
