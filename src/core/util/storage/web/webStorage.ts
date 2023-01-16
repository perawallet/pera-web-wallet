const {localStorage, sessionStorage} = window;

const webStorage = {
  local: {
    setItem(itemName: string, itemValue: WebStorageStoredValue) {
      localStorage.setItem(itemName, JSON.stringify(itemValue));
    },
    getItem(itemName: string): WebStorageStoredValue {
      let storedValue = localStorage.getItem(itemName);

      storedValue = storedValue ? JSON.parse(storedValue) : null;

      return storedValue;
    },
    removeItem(itemName: string) {
      localStorage.removeItem(itemName);
    }
  },
  session: {
    setItem(itemName: string, itemValue: WebStorageStoredValue) {
      sessionStorage.setItem(itemName, JSON.stringify(itemValue));
    },
    getItem(itemName: string): WebStorageStoredValue {
      let storedValue = sessionStorage.getItem(itemName);

      storedValue = storedValue ? JSON.parse(storedValue) : null;

      return storedValue;
    },
    removeItem(itemName: string) {
      sessionStorage.removeItem(itemName);
    }
  },
  cookie: {
    getCookie(name: string) {
      const cookies = Object.fromEntries(
        document.cookie
          .split("; ")
          .map((cookie) => cookie.split("=").map(decodeURIComponent))
      );

      return cookies[name] || null;
    },
    deleteCookie(name: string) {
      document.cookie = `${name}=; Max-Age=-99999999;`;
    }
  },
  getFromWebStorage(itemName: string): WebStorageStoredValue {
    let itemValue = webStorage.local.getItem(itemName);

    if (!itemValue) {
      itemValue = webStorage.session.getItem(itemName);
    }

    return itemValue;
  },
  removeFromWebStorage(itemName: string) {
    webStorage.session.removeItem(itemName);
    webStorage.local.removeItem(itemName);
  }
};

const STORED_KEYS = {
  LOCK_TABS: "lock-tabs",
  HIDE_ASSET_OPTIN_INFO_MODAL: "hide-asset-optin-info-modal",
  HIDE_SEND_TXN_INFO_MODAL: "hide-send-txn-info-modal",
  CREATED_NEW_ACCOUNT: "created-new-account",

  // Common App States
  THEME: "theme",
  HASHED_MASTERKEY: "pera-hash",
  PREFERRED_NETWORK: "preferred-network",

  // Encrypted Common App States
  DEVICE_INFO: "device-info",
  STALE_PORTFOLIO_OVERVIEW: "stale-portfolio-overview"
} as const;

export default webStorage;
export {STORED_KEYS};
