export type AccountImportLedgerPageSteps =
  | "PAIR"
  | "PLUG"
  | "INSTALL"
  | "OPEN"
  | "IS_ENABLED";

export type AccountImportLedgerPageStepProps = {
  title: string;
  subtitle: string;
  ctaText?: string;
};

export const ACCOUNT_IMPORT_LEDGER_PAGE_USB_STEPS: Omit<
  Record<AccountImportLedgerPageSteps, AccountImportLedgerPageStepProps>,
  "IS_ENABLED"
> = {
  PAIR: {
    title: "Pair Your Ledger Nano",
    subtitle:
      "In the following steps, you'll connect your hardware wallet. Once connected, you'll be able to use your Ledger accounts with Pera."
  },
  PLUG: {
    title: "Plug in your Ledger",
    subtitle: "Connect your Ledger device to your desktop using its USB connector."
  },
  INSTALL: {
    title: "Install the Algorand App on your Ledger",
    subtitle:
      "Open Ledger Live and navigate to My Ledger. Select the App catalog, search for Algorand (ALGO), and click Install.",
    ctaText: `I have it installed ${"  "}→`
  },
  OPEN: {
    title: "Open Algorand App",
    subtitle: `Unlock your Ledger and open the Algorand App. Press "Search for devices" when you're ready to connect your ledger.`
  }
};

export const ACCOUNT_IMPORT_LEDGER_PAGE_BLUETOOTH_STEPS: Record<
  AccountImportLedgerPageSteps,
  AccountImportLedgerPageStepProps
> = {
  PAIR: ACCOUNT_IMPORT_LEDGER_PAGE_USB_STEPS.PAIR,
  PLUG: {
    title: "Turn on your Ledger",
    subtitle: "Bluetooth is enabled by default on your Ledger device."
  },
  INSTALL: ACCOUNT_IMPORT_LEDGER_PAGE_USB_STEPS.INSTALL,
  IS_ENABLED: {
    title: "Make sure Bluetooth is enabled",
    subtitle:
      "Ensure Bluetooth is enabled on your desktop device. On Mac this is located in System Settings > Bluetooth. On Windows this is located in Settings > Devices > Bluetooth and Other Devices."
  },
  OPEN: ACCOUNT_IMPORT_LEDGER_PAGE_USB_STEPS.OPEN
};

const ACCOUNT_IMPORT_LEDGER_PAGE_STEPS = {
  USB: ACCOUNT_IMPORT_LEDGER_PAGE_USB_STEPS,
  BLUETOOTH: ACCOUNT_IMPORT_LEDGER_PAGE_BLUETOOTH_STEPS
} as const;

export {ACCOUNT_IMPORT_LEDGER_PAGE_STEPS};
