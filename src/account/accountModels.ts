export interface AccountBackup {
  id: string;
  encrypted_backup: null;
  date_created: string;
  modification_key: string;
}

// private_key is a stringified uint8Array
export type MobileSyncAccount = {name: string; private_key: string};

export type EncryptedPeraMobileAccounts = {
  device_id: string;
  accounts: string;
};
