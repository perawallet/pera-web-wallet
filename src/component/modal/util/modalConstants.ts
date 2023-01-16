import {SECOND_IN_MS} from "../../../core/util/time/timeConstants";

const MODAL_CLOSE_TIMEOUT =
  parseFloat(
    getComputedStyle(document.documentElement)
      .getPropertyValue("--default-animation")
      .trim() || "0.2"
  ) * SECOND_IN_MS;

export {MODAL_CLOSE_TIMEOUT};
