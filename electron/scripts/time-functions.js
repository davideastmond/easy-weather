const moment = require("moment-timezone");
const assert = require("assert");
/**
 * Converts unix time and localizes - formats it correctly
 * @param {number} rawUnixTime raw unix time
 * @param {string} timezone date time format string as per moment
 * @param {string} formatting localStorage object
 */
export function getConvertedTime(rawUnixTime, timezone, formatting) {
  assert(!isNaN(rawUnixTime), "rawUnixTime not a number");
  assert(timezone, "timezone is not defined");
  const utcTime = moment.utc(moment.unix(rawUnixTime)).tz(timezone);
  return moment(utcTime).format(formatting);
}
