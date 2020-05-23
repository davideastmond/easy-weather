/**
 * an hourlyStrip template is a table row of hourly data from the API.
 */
export const hourlyStrip = ({
  styling,
  dateTime,
  temp,
  feels_like,
  icon,
  main_desc,
  sup_desc,
  wind
}) => `
<tr class="${styling} row-no-padding">
  <td>${dateTime}</td>
  <td><div>${temp}</div> <div class="hourly-feels-like"> Feels like: ${feels_like}</div></td>
  <td> <img class="hourly-card-icon" src=${icon}></td>
  <td> <div> ${main_desc} </div> <div> ${sup_desc}</div></td>
  <td>${wind}</td>
</tr>`;
