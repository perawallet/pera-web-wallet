import algosdk from "algosdk";

import {
  ACCOUNT_ADDRESS_TRUNCATE_LENGTH,
  ACCOUNT_NAME_TRUNCATE_LENGTH,
  MAX_AVAILABLE_ACCOUNTS
} from "./accountConstants";
import {ARCStandardMobileSyncAccount, MobileSyncAccount} from "../accountModels";

/**
 * Shortens the given account address
 * @param {string} accountAddress
 * @returns {string} AAAAAA...AAAAAAA
 */
function trimAccountAddress(accountAddress: string) {
  return `${accountAddress.slice(
    0,
    ACCOUNT_ADDRESS_TRUNCATE_LENGTH
  )}...${accountAddress.slice(-ACCOUNT_ADDRESS_TRUNCATE_LENGTH)}`;
}

/**
 * Shortens the given account name
 * @param {string} accountName
 * @returns {string} Shortened account name...
 */
function trimAccountName(
  accountName: string,
  truncateLength = ACCOUNT_NAME_TRUNCATE_LENGTH
) {
  return accountName.length > truncateLength
    ? `${accountName.slice(0, truncateLength)}...`
    : accountName;
}

interface FormValidationInfo<T> {
  type: T;
  title: string;
  message: string[];
}

type AccountCreateFormValidationInfo = FormValidationInfo<
  "ACCOUNT_NAME_EXISTS" | "ACCOUNT_LIMIT_EXCEEDED"
>;

function validateAccountCreateForm(
  accounts: AppDBScheme["accounts"],
  accountName: string
) {
  const accountAddressArray = Object.values(accounts);
  const hasSameaccountName = accountAddressArray.find(
    (account) => account.name === accountName
  );
  let validationInfo: AccountCreateFormValidationInfo | undefined;

  if (hasSameaccountName) {
    validationInfo = {
      type: "ACCOUNT_NAME_EXISTS",
      title: "Account name already exists",
      message: ["Please choose another name"]
    };
  } else if (accountAddressArray.length >= MAX_AVAILABLE_ACCOUNTS) {
    validationInfo = {
      type: "ACCOUNT_LIMIT_EXCEEDED",
      title: "You've reached maximum number of account",
      message: ["Maximum number of 50 accounts can be created."]
    };
  }

  return validationInfo;
}

/**
 * Returns the lastly created account address
 * @param {array} AppDBScheme.accounts
 * @returns {string}
 */
function getLastAccountAddress(accounts: AppDBScheme["accounts"]) {
  const accountAddressArray = Object.values(accounts);

  return accountAddressArray.sort((left, right) => {
    const leftDate = left.date?.getTime() || 0;
    const rightDate = right.date?.getTime() || 0;

    return rightDate - leftDate;
  })[0].address;
}

/**
 * Gets privateKey and derive mnemonic
 * Uses this mnemonic to get AccountInfo via algosdk.mnemonicToSecretKey method
 * Throws error if mnemonicToSecretKey method fails
 *
 * @param {(Uint8Array)} privateKey
 * @returns
 */
function deriveAccountFromPrivateKey(privateKey: Uint8Array) {
  const mnemonic = algosdk.secretKeyToMnemonic(privateKey);

  return algosdk.mnemonicToSecretKey(mnemonic);
}

function getHighestBalanceAccount(
  accounts: PortfolioOverview["accounts"]
): AccountOverview | undefined {
  return Object.values(accounts).sort(
    (account1, account2) =>
      Number(account2.total_algo_value) - Number(account1.total_algo_value)
  )[0];
}

function isARCStandardMobileSyncAccount(
  account: MobileSyncAccount
): account is ARCStandardMobileSyncAccount {
  return (account as ARCStandardMobileSyncAccount).account_type !== undefined;
}

function getAccountType(account: Partial<AccountOverview>): AccountType {
  if (account?.bip32 !== undefined) return "ledger";

  if (account?.pk !== undefined) return "standard";

  return "watch";
}

export {
  trimAccountAddress,
  trimAccountName,
  validateAccountCreateForm,
  deriveAccountFromPrivateKey,
  getLastAccountAddress,
  getAccountType,
  getHighestBalanceAccount,
  isARCStandardMobileSyncAccount
};
