import {ReactComponent as AccountLedgerIcon} from "../../core/ui/icons/account-ledger.svg";
import {ReactComponent as AccountDefaultIcon} from "../../core/ui/icons/account-default.svg";

import algosdk from "algosdk";

import {
  ACCOUNT_ADDRESS_TRUNCATE_LENGTH,
  ACCOUNT_NAME_TRUNCATE_LENGTH,
  MAX_AVAILABLE_ACCOUNTS
} from "./accountConstants";
import {PortfolioOverview} from "../../overview/util/hook/usePortfolioOverview";

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

function getLastAccountType(accounts: AppDBScheme["accounts"]) {
  const accountAddressArray = Object.values(accounts);

  return accountAddressArray.sort((left, right) => {
    const leftDate = left.date?.getTime() || 0;
    const rightDate = right.date?.getTime() || 0;

    return rightDate - leftDate;
  })[0].type;
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

function getAccountIcon({
  type = "standard",
  width,
  height
}: {
  type?: AccountType;
  width: number;
  height: number;
}) {
  let icon: React.ReactNode;

  switch (type) {
    case "ledger":
      icon = <AccountLedgerIcon width={width} height={height} />;
      break;
    default:
      icon = <AccountDefaultIcon width={width} height={height} />;
      break;
  }

  return icon;
}

function getHighestBalanceAccount(
  accounts: PortfolioOverview["accounts"]
): AccountOverview | undefined {
  return accounts.sort(
    (account1, account2) =>
      Number(account2.total_algo_value) - Number(account1.total_algo_value)
  )[0];
}

/* eslint-enable no-magic-numbers */

export {
  trimAccountAddress,
  trimAccountName,
  validateAccountCreateForm,
  deriveAccountFromPrivateKey,
  getLastAccountAddress,
  getLastAccountType,
  getAccountIcon,
  getHighestBalanceAccount
};
