import {MINUTE_IN_MS, SECOND_IN_MS} from "../../../core/util/time/timeConstants";

const SYNC_MOBILE_TO_WEB_CONSTANTS = {
  TITLE: "Import from Pera Mobile",
  INSTRUCTIONS: [
    "Scan this QR code on Pera Mobile",
    "Follow the instructions on your app",
    "Your accounts will be imported to Pera Web"
  ]
};

const SYNC_WEB_TO_MOBILE_CONSTANTS = {
  TITLE: "Transfer to Pera Mobile",
  INSTRUCTIONS: [
    "Scan this QR code on Pera Mobile",
    "Follow the instructions on your app"
  ]
};

// eslint-disable-next-line no-magic-numbers
const PERA_SYNC_POLLING_INTERVAL = SECOND_IN_MS * 2;

// Polling will stop in 2 minutes via useCheckForInactivity hook in case of missing clicks
// This polling limit is just a double check for unnecessary requests
// eslint-disable-next-line no-magic-numbers
const PERA_SYNC_POLLING_LIMIT = 5 * (MINUTE_IN_MS / PERA_SYNC_POLLING_INTERVAL);

export {
  SYNC_WEB_TO_MOBILE_CONSTANTS,
  SYNC_MOBILE_TO_WEB_CONSTANTS,
  PERA_SYNC_POLLING_INTERVAL,
  PERA_SYNC_POLLING_LIMIT
};
