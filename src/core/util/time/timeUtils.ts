/* eslint-disable import/no-duplicates */
import enCA from "date-fns/locale/en-CA";
import formatWithOptions from "date-fns/fp/formatWithOptions";
import {formatInTimeZone, utcToZonedTime} from "date-fns-tz";

import {FormatDateUtilOptions} from "./timeTypes";
import {MINUTE_IN_MS} from "./timeConstants";
import {getLocalTimezone} from "./timezoneUtils";

/**
 * Formats a Date object into a human friendly string
 *
 * Note on usage:
 *    Whenever the timezone information is not available and a date object that is passed to this function is generated from a ISO-8601 date string (yyyy-MM-dd), `shouldShiftDateToCompensateForTimezone` option should be set to `true`.
 *    Otherwise, the displayed date would be inconsistent with the data. For example, for a user with Eastern Daylight Time (to generalize, any user that has a negative UTC offset), the following Date object is created for "2007-05-16": Tue May 15 2007 20:00:00 GMT-0400 (Eastern Daylight Time) {}. Therefore, 15 May appears on the screen. By passing `new Date("2007-05-16")` value to `compensateForTimezone` utility, we fix this problem.
 *    When the timezone information is passed to `formatDateWithOptions`, this extra compensation is redundant as `date-fns-tz/utcToZonedTime` handles it corrently.
 *
 * @param {object} options FormatDateUtilOptions
 * @return {string} Formatted date
 */
function formatDateWithOptions(options: FormatDateUtilOptions) {
  const {
    format,
    shouldShiftDateToCompensateForTimezone = true,
    isProvidedDateInUTC = true,
    timezone = getLocalTimezone()
  } = options || {};

  return (date: Date): string => {
    let dateToFormat = date;

    if (timezone && isProvidedDateInUTC) {
      dateToFormat = utcToZonedTime(date, timezone);
    } else if (!timezone && shouldShiftDateToCompensateForTimezone) {
      dateToFormat = compansateForTimezone(date);
    }

    return timezone
      ? formatInTimeZone(dateToFormat, timezone, format, {
          locale: enCA,
          timeZone: timezone
        })
      : formatWithOptions({locale: enCA}, format)(dateToFormat);
  };
}

/**
 * Shifts the time of the Date object by the system's UTC offset to avoid timezone issues.
 *
 * For example, for a user with Eastern Daylight Time (to generalize, any user that has a negative UTC offset), the following Date object is created for "2007-05-16": Tue May 15 2007 20:00:00 GMT-0400 (Eastern Daylight Time) {}.
 * By using this utility we get the following Date object: `compansateForTimezone(new Date("2007-05-16"))` = Tue May 16 2007 00:00:00 GMT-0400 (Eastern Daylight Time) {}
 *
 * @param {Date} date Date to shift
 * @return {Date} shifted Date
 */
function compansateForTimezone(date: Date): Date {
  // `Date.prototype.getTimezoneOffset` returns a value signed according to the locale timezone offset. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
  return new Date(date.getTime() - date.getTimezoneOffset() * -1 * MINUTE_IN_MS);
}

export {formatDateWithOptions};
