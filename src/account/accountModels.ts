export interface AccountBackup {
  id: string;
  encrypted_backup: null;
  date_created: string;
  modification_key: string;
}

export type LegacyMobileSyncAccount = {
  name: string;
  private_key: string; // stringified uint8Array
};

export type ARCStandardAccountType =
  | "single"
  | "multisig"
  | "watch"
  | "ledger"
  | "contact";

export type ARCStandardMobileSyncAccount = {
  name: string;
  address: string;
  private_key: string; // base64
  account_type: "single"; // pera supports single accounts for now
  metadata?: string;
};

export type MobileSyncAccount = ARCStandardMobileSyncAccount | LegacyMobileSyncAccount;

export type EncryptedPeraMobileAccounts = {
  device_id: string;
  accounts: string;
};
