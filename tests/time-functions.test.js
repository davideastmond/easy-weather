import {
  getConvertedTime
} from "../electron/scripts/time-functions.js";

describe("Time conversion functionality", () => {
  test("batch converting to correct localized times", () => {
    const unixTimes = [315536400, 971613000, 1608825420];
    const timeZones = ["Europe/London", "America/Vancouver", "Australia/Sydney"];
    const expectedConversions = ["1980 01 01 01:00", "2000 10 15 05:30", "2020 12 25 02:57"];
    const formatSetting = "YYYY MM DD HH:mm";

    unixTimes.forEach((unixTime, index) => {
      expect(getConvertedTime(unixTime, timeZones[index], formatSetting)).toBe(expectedConversions[index]);
    });
  });
  test("formatting for time of day", () => {
    const unixTimes = [315536400, 971613000, 1608825420];
    const timeZones = ["Europe/London", "America/Vancouver", "Australia/Sydney"];
    const expectedConversions = ["01:00", "05:30", "02:57"];
    const formatSetting = "HH:mm";
    const alternateFormatSetting = "h:mm a";

    unixTimes.forEach((unixTime, index) => {
      expect(getConvertedTime(unixTime, timeZones[index], formatSetting)).toBe(expectedConversions[index]);
    });

    // AM/PM format
    expect(getConvertedTime(unixTimes[2], timeZones[2], alternateFormatSetting)).toBe("2:57 am");
  });
  test("formatting for day of week", () => {
    const unixTimes = [1593302400, 1593618600, 1593904620];
    const timeZones = ["Asia/Shanghai", "America/Chicago", "Pacific/Honolulu"];
    const expectedDaysOfWeek = ["Sunday", "Wednesday", "Saturday"];
    const formatSetting = "dddd";

    unixTimes.forEach((time, index) => {
      expect(getConvertedTime(time, timeZones[index], formatSetting)).toBe(expectedDaysOfWeek[index]);
    });
  });
});
