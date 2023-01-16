import {DATE_FORMAT} from "../../core/util/time/timeConstants";
import {formatDateWithOptions} from "../../core/util/time/timeUtils";

function formatPeraConnectSessionDate(date: Date) {
  const dayMonthYear = formatDateWithOptions({
    format: DATE_FORMAT.DEFAULT
  })(date);

  const hourMinute = formatDateWithOptions({
    format: DATE_FORMAT.DEFAULT_HOUR_MINUTE
  })(date);

  return `${dayMonthYear} at ${hourMinute}`;
}

export {formatPeraConnectSessionDate};
