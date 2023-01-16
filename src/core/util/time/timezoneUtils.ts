/**
 * Returns the browser's system timezone.
 * eg. "Canada/Central"
 * @return {string} Local timezone
 */
function getLocalTimezone() {
  let timeZone = "";

  try {
    timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error(error);
  }

  return timeZone;
}

export {getLocalTimezone};
