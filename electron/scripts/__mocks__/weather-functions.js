export async function getForecastFromAPI() {
  return Promise.resolve({
    status: 200,
    data: {
      hourly: Array(48),
      current: {},
      daily: {},
      minutely: {},
      timezone: "America/Toronto"
    }
  });
}
