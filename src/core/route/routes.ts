const BASE = "/" as const;
const PASSWORD_ROUTE = "password";
const SUCCESS_ROUTE = "success";
const CREATE_ROUTE = "create";
const PENDING_ROUTE = "pending";
const ACCESS_ROUTE = "access";
const QR_ROUTE = "qr";
const PASSPHRASE_ROUTE = "passphrase";
const ACCOUNTS_ROUTE = "accounts";

// ==== Overview Flow ====
const OVERVIEW_ROUTE = "overview";

// ==== Connect Flow ====
const CONNECT_ROUTE = "connect";

// ==== Account Flow ====
const ACCOUNT_ROUTE = "account";

const ACCOUNT_PASSPHRASE_RECOVERY_ROUTE = "recovery";
const ACCOUNT_PASSPHRASE_VERIFY_ROUTE = "verify";

const ACCOUNT_IMPORT_ROUTE = "import";
const ACCOUNT_IMPORT_PASSPHRASE_NAME = "name";
const ACCOUNT_IMPORT_PERA_SYNC_ROUTE = "pera";
const ACCOUNT_IMPORT_LEDGER_ROUTE = "ledger";

// ==== Transaction Flow ====
const TRANSACTION_ROUTE = "transaction";
const TRANSACTION_SIGN_ROUTE = "sign";

// ==== Send Flow ====
const SEND_TXN_ROUTE = "send";
const SEND_TXN_ASSETS_ROUTE = "assets";
const SEND_TXN_CONFIRM_ROUTE = "confirm";

// ==== Opt-in Flow ====
const ASSET_OPTIN_ROUTE = "optin";

// ==== Settings Flow ====
const SETTINGS_ROUTE = "settings";
const SESSIONS_ROUTE = "sessions";

// ==== Backup Flow ====
const BACKUP_ROUTE = "backup";
const BACKUP_FILE_ROUTE = "file";

// ==== Transfer Flow ====
const TRANSFER_ROUTE = "transfer";

const ROUTES = {
  BASE,

  ACCESS: {
    ROUTE: `${BASE}${ACCESS_ROUTE}`
  },

  PASSWORD: {
    ROUTE: `${BASE}${PASSWORD_ROUTE}`,

    CREATE: {
      ROUTE: `${CREATE_ROUTE}`,
      FULL_PATH: `${BASE}${PASSWORD_ROUTE}/${CREATE_ROUTE}`
    }
  },

  OVERVIEW: {
    ROUTE: `${BASE}${OVERVIEW_ROUTE}`
  },

  CONNECT: {
    ROUTE: `${BASE}${CONNECT_ROUTE}`
  },

  TRANSFER: {
    ROUTE: `${BASE}${TRANSFER_ROUTE}`,

    QR: {
      ROUTE: QR_ROUTE,
      FULL_PATH: `${BASE}${TRANSFER_ROUTE}/${QR_ROUTE}`
    }
  },

  ACCOUNT: {
    ROUTE: `${BASE}${ACCOUNT_ROUTE}`,

    CREATE: {
      ROUTE: CREATE_ROUTE,
      FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${CREATE_ROUTE}`,

      PASSPHRASE: {
        ROUTE: PASSPHRASE_ROUTE,
        FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${CREATE_ROUTE}/${PASSPHRASE_ROUTE}`
      },

      PENDING: {
        ROUTE: PENDING_ROUTE,
        FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${CREATE_ROUTE}/${PENDING_ROUTE}`
      },

      SUCCESS: {
        ROUTE: SUCCESS_ROUTE,
        FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${CREATE_ROUTE}/${SUCCESS_ROUTE}`
      }
    },

    PASSPHRASE: {
      ROUTE: PASSPHRASE_ROUTE,
      FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${PASSPHRASE_ROUTE}`,

      RECOVERY: {
        ROUTE: ACCOUNT_PASSPHRASE_RECOVERY_ROUTE,
        FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${PASSPHRASE_ROUTE}/${ACCOUNT_PASSPHRASE_RECOVERY_ROUTE}`
      },

      VERIFY: {
        ROUTE: ACCOUNT_PASSPHRASE_VERIFY_ROUTE,
        FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${PASSPHRASE_ROUTE}/${ACCOUNT_PASSPHRASE_VERIFY_ROUTE}`
      },

      SUCCESS: {
        ROUTE: SUCCESS_ROUTE,
        FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${PASSPHRASE_ROUTE}/${SUCCESS_ROUTE}`
      }
    },

    IMPORT: {
      ROUTE: ACCOUNT_IMPORT_ROUTE,
      FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}`,

      PASSPHRASE: {
        ROUTE: PASSPHRASE_ROUTE,
        FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}/${PASSPHRASE_ROUTE}`,

        RECOVERY: {
          ROUTE: ACCOUNT_PASSPHRASE_RECOVERY_ROUTE,
          FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}/${PASSPHRASE_ROUTE}/${ACCOUNT_PASSPHRASE_RECOVERY_ROUTE}`
        },

        NAME: {
          ROUTE: ACCOUNT_IMPORT_PASSPHRASE_NAME,
          FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}/${PASSPHRASE_ROUTE}/${ACCOUNT_IMPORT_PASSPHRASE_NAME}`
        },

        SUCCESS: {
          ROUTE: SUCCESS_ROUTE,
          FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}/${PASSPHRASE_ROUTE}/${SUCCESS_ROUTE}`
        },

        PENDING: {
          ROUTE: PENDING_ROUTE,
          FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}/${PASSPHRASE_ROUTE}/${PENDING_ROUTE}`
        }
      },

      PERA_SYNC: {
        ROUTE: ACCOUNT_IMPORT_PERA_SYNC_ROUTE,
        FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}/${ACCOUNT_IMPORT_PERA_SYNC_ROUTE}`,

        QR: {
          ROUTE: QR_ROUTE,
          FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}/${ACCOUNT_IMPORT_PERA_SYNC_ROUTE}/${QR_ROUTE}`
        },

        SUCCESS: {
          ROUTE: SUCCESS_ROUTE,
          FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}/${ACCOUNT_IMPORT_PERA_SYNC_ROUTE}/${SUCCESS_ROUTE}`
        }
      },

      LEDGER: {
        ROUTE: ACCOUNT_IMPORT_LEDGER_ROUTE,
        FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}/${ACCOUNT_IMPORT_LEDGER_ROUTE}`
      },

      BACKUP: {
        ROUTE: BACKUP_ROUTE,
        FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}/${BACKUP_ROUTE}`,

        FILE: {
          ROUTE: BACKUP_FILE_ROUTE,
          FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}/${BACKUP_ROUTE}/${BACKUP_FILE_ROUTE}`
        },

        PASSPHRASE: {
          ROUTE: PASSPHRASE_ROUTE,
          FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}/${BACKUP_ROUTE}/${PASSPHRASE_ROUTE}`
        },

        ACCOUNTS: {
          ROUTE: ACCOUNTS_ROUTE,
          FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}/${BACKUP_ROUTE}/${ACCOUNTS_ROUTE}`
        },

        SUCCESS: {
          ROUTE: SUCCESS_ROUTE,
          FULL_PATH: `${BASE}${ACCOUNT_ROUTE}/${ACCOUNT_IMPORT_ROUTE}/${BACKUP_ROUTE}/${SUCCESS_ROUTE}`
        }
      }
    }
  },

  TRANSACTION: {
    ROUTE: `${BASE}${TRANSACTION_ROUTE}`,

    SIGN: {
      ROUTE: TRANSACTION_SIGN_ROUTE,
      FULL_PATH: `${BASE}${TRANSACTION_ROUTE}/${TRANSACTION_SIGN_ROUTE}`
    }
  },

  SEND_TXN: {
    ROUTE: `${BASE}${SEND_TXN_ROUTE}`,

    ACCOUNTS: {
      ROUTE: ACCOUNTS_ROUTE,
      FULL_PATH: `${BASE}${SEND_TXN_ROUTE}/${ACCOUNTS_ROUTE}`
    },

    ASSETS: {
      ROUTE: SEND_TXN_ASSETS_ROUTE,
      FULL_PATH: `${BASE}${SEND_TXN_ROUTE}/${SEND_TXN_ASSETS_ROUTE}`
    },

    CONFIRM: {
      ROUTE: SEND_TXN_CONFIRM_ROUTE,
      FULL_PATH: `${BASE}${SEND_TXN_ROUTE}/${SEND_TXN_CONFIRM_ROUTE}`
    },

    SUCCESS: {
      ROUTE: SUCCESS_ROUTE,
      FULL_PATH: `${BASE}${SEND_TXN_ROUTE}/${SUCCESS_ROUTE}`
    }
  },

  ASSET_OPTIN: {
    ROUTE: `${BASE}${ASSET_OPTIN_ROUTE}`,

    ACCOUNTS: {
      ROUTE: ACCOUNTS_ROUTE,
      FULL_PATH: `${BASE}${ASSET_OPTIN_ROUTE}/${ACCOUNTS_ROUTE}`
    }
  },

  SETTINGS: {
    ROUTE: `${BASE}${SETTINGS_ROUTE}`,

    BACKUP: {
      ROUTE: BACKUP_ROUTE,
      FULL_PATH: `${BASE}${SETTINGS_ROUTE}/${BACKUP_ROUTE}`,

      PASSPHRASE: {
        ROUTE: PASSPHRASE_ROUTE,
        FULL_PATH: `${BASE}${SETTINGS_ROUTE}/${BACKUP_ROUTE}/${PASSPHRASE_ROUTE}`
      },

      FILE: {
        ROUTE: BACKUP_FILE_ROUTE,
        FULL_PATH: `${BASE}${SETTINGS_ROUTE}/${BACKUP_ROUTE}/${BACKUP_FILE_ROUTE}`
      }
    },

    SESSIONS: {
      ROUTE: SESSIONS_ROUTE,
      FULL_PATH: `${BASE}${SETTINGS_ROUTE}/${SESSIONS_ROUTE}`
    },

    TRANSFER_MOBILE: {
      ROUTE: TRANSFER_ROUTE,
      FULL_PATH: `${BASE}${SETTINGS_ROUTE}/${TRANSFER_ROUTE}`,

      QR: {
        ROUTE: QR_ROUTE,
        FULL_PATH: `${BASE}${SETTINGS_ROUTE}/${TRANSFER_ROUTE}/${QR_ROUTE}`
      }
    }
  }
} as const;

export default ROUTES;
