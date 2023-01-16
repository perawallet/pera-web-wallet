function isNavigatorAvailable() {
  return typeof navigator !== "undefined";
}

function isSmallMobileDevice() {
  return (
    isNavigatorAvailable() &&
    ((/Mobile/i.test(navigator.userAgent) && /Android/i.test(navigator.userAgent)) ||
      /iPhone/i.test(navigator.userAgent))
  );
}

function isFirefoxPrivate(): Promise<boolean> {
  const isUserAgentFirefox = !!navigator.userAgent.match(/Firefox/i);

  return new Promise((resolve) => {
    if (!isUserAgentFirefox) resolve(false);

    const temporaryDBName = "firefox-private-test";
    const db = indexedDB.open(temporaryDBName);

    db.onerror = function () {
      resolve(true);
    };

    db.onsuccess = function () {
      indexedDB.deleteDatabase(temporaryDBName);
      resolve(false);
    };
  });
}

export {isSmallMobileDevice, isFirefoxPrivate};
