/* eslint-disable no-magic-numbers */

const DATE_FORMAT = {
  DEFAULT: "MMMM d, y",
  DEFAULT_MONTH_AND_DAY: "MMM d",
  MONTH_YEAR_AND_HOUR_MINUTE: "MMM yyyy, 'at' h:mm a",
  DEFAULT_HOUR_MINUTE: "h:mm a",
  MONTH: "MMM",
  API_FORMAT: "yyyy-MM-dd"
};
const SECOND_IN_MS = 1000;
const MINUTE_IN_S = 60;
const MINUTE_IN_MS = MINUTE_IN_S * SECOND_IN_MS;
const HALF_MINUTE_IN_MS = MINUTE_IN_MS / 2;
const HOUR_IN_MINUTES = 60;
const DAY_IN_HOURS = 24;
const WEEK_IN_DAYS = 7;

export {
  DATE_FORMAT,
  SECOND_IN_MS,
  HALF_MINUTE_IN_MS,
  MINUTE_IN_MS,
  HOUR_IN_MINUTES,
  DAY_IN_HOURS,
  WEEK_IN_DAYS
};
