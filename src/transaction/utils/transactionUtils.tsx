/* eslint-disable max-lines */
import algosdk, {isValidAddress, OnApplicationComplete, Transaction} from "algosdk";

import {GENESIS_HASH_BY_NETWORK} from "../../core/util/algod/algodConstants";
import {base64ToUint8Array, uint8ArrayToBase64} from "../../core/util/blob/blobUtils";
import {SignerTransaction} from "../../core/util/model/peraWalletModel";

export interface TransactionTypeCounts {
  appl: number;
  axfer: number;
  pay: number;
  axferReceive: number;
  acfg: number;
}

const TRANSACTION_TYPE_LABEL_MAP = {
  appl: "Application Call",
  axferReceive: "Receive",
  axfer: "Asset Transfer",
  pay: "Payment",
  acfg: "Asset Config"
};

function getTransactionTypeCounts(transactions: Transaction[], userAddress: string) {
  return transactions.reduce(
    (acc, txn) => {
      const type = getTransactionType(txn, userAddress) as keyof TransactionTypeCounts;

      if (type) {
        acc[type] = acc[type] ? acc[type] + 1 : 1;
      }
      return acc;
    },
    {
      appl: 0,
      axfer: 0,
      pay: 0,
      axferReceive: 0,
      acfg: 0
    }
  );
}

function getTransactionType(transaction: Transaction, userAddress: string) {
  return checkIfTransactionIsAxferReceive(transaction, userAddress)
    ? "axferReceive"
    : transaction.type;
}

function getTransactionTypeText(transaction: Transaction, userAddress: string) {
  return TRANSACTION_TYPE_LABEL_MAP[
    getTransactionType(transaction, userAddress) as keyof TransactionTypeCounts
  ];
}

function getTransactionTypeCountTexts(transactions: Transaction[], userAddress: string) {
  const transactionTypeCounts = getTransactionTypeCounts(transactions, userAddress);

  return Object.keys(transactionTypeCounts)
    .filter((type) => transactionTypeCounts[type as keyof TransactionTypeCounts] > 0)
    .map((type) => {
      const typeNumber = transactionTypeCounts[type as keyof TransactionTypeCounts];

      return `${typeNumber}x ${
        TRANSACTION_TYPE_LABEL_MAP[type as keyof TransactionTypeCounts]
      }`;
    });
}

function seperateTransactionReceiveAndSpend(
  transactions: SignerTransaction[],
  userAddress: string
) {
  const receiveTransactions: Transaction[] = transactions.map(
    (transaction) => transaction.txn
  );

  return receiveTransactions.reduce(
    (txns, txn) => {
      if (checkIfTransactionSignedBySomebodyElse(txn, userAddress)) {
        if (checkIfTransactionIsAxferReceive(txn, userAddress)) {
          txns.receiveTransactions.push(txn);
        } else {
          txns.signedBySomebodyElseTransactions.push(txn);
        }
      } else if (checkIfTransactionApplicationCall(txn)) {
        txns.applicationCallTransactions.push(txn);
      } else if (checkIfTransactionOptIn(txn, userAddress)) {
        txns.optInTransactions.push(txn);
      } else if (checkIfTransactionIsReceive(txn, userAddress)) {
        txns.receiveTransactions.push(txn);
      } else if (checkIfTransactionAssetConfig(txn)) {
        txns.assetConfigTransactions.push(txn);
      } else {
        txns.spendTransactions.push(txn);
      }
      return txns;
    },
    {
      signedBySomebodyElseTransactions: [] as Transaction[],
      receiveTransactions: [] as Transaction[],
      spendTransactions: [] as Transaction[],
      optInTransactions: [] as Transaction[],
      applicationCallTransactions: [] as Transaction[],
      assetConfigTransactions: [] as Transaction[]
    }
  );
}

function getOptInTransactions(transactions: Transaction[], userAddress: string) {
  return transactions.filter((transaction) =>
    checkIfTransactionOptIn(transaction, userAddress)
  );
}

function getApplicationCallTransactions(transactions: Transaction[]) {
  return transactions.filter((transaction) =>
    checkIfTransactionApplicationCall(transaction)
  );
}

function isCreateApplicationTransaction(transaction: Transaction) {
  return transaction.type === "appl" && transaction.appIndex === undefined;
}

function getAssetIndexesFromTransactions(transactions: SignerTransaction[]) {
  return transactions.reduce((assetIndexes, transaction) => {
    if (transaction?.txn.assetIndex) {
      assetIndexes.push(transaction.txn.assetIndex);
    }

    return assetIndexes;
  }, [] as number[]);
}

function checkIfTransactionIsReceive(transaction: Transaction, userAddress: string) {
  return Boolean(
    transaction.to
      ? algosdk.encodeAddress(transaction.to.publicKey) === userAddress
      : false
  );
}

function checkIfTransactionIsAxferReceive(transaction: Transaction, userAddress: string) {
  return (
    checkIfTransactionIsReceive(transaction, userAddress) && transaction.type === "axfer"
  );
}

function checkIfTransactionSignedBySomebodyElse(
  transaction: Transaction,
  userAddress: string
) {
  return Boolean(algosdk.encodeAddress(transaction.from?.publicKey) !== userAddress);
}

function checkIfTransactionOptIn(transaction: Transaction, userAddress: string) {
  return Boolean(
    transaction.assetIndex &&
      (!transaction.amount || Number(transaction.amount) === 0) &&
      getTransactionType(transaction, userAddress) === "axferReceive"
  );
}

function checkIfTransactionApplicationCall(transaction: Transaction) {
  return transaction.type === "appl";
}

function checkIfTransactionAssetConfig(transaction: Transaction) {
  return transaction.type === "acfg";
}

function isTransactionTypeSupported(transaction: Transaction, userAddress: string) {
  return getTransactionTypeText(transaction, userAddress) !== undefined;
}

function checkIfTransactionNetworkIsMatches(
  transaction: Transaction,
  network: NetworkToggle
) {
  return uint8ArrayToBase64(transaction.genesisHash) === GENESIS_HASH_BY_NETWORK[network];
}

function checkIfSignRequiredForTransactions(
  transactions: SignerTransaction[],
  currentSession: AppDBSession
) {
  return transactions.some((transaction) =>
    checkIfSignRequiredForTransaction(transaction, currentSession)
  );
}

function checkIfSignRequiredForTransaction(
  transaction: SignerTransaction,
  currentSession: AppDBSession
) {
  const signerAddress = getSignerAddress(transaction);

  return currentSession?.accountAddresses.includes(signerAddress);
}

function getSignerAddress(transaction: SignerTransaction) {
  if (transaction.authAddr && isValidAddress(transaction.authAddr)) {
    return transaction.authAddr;
  }

  if (transaction.signers) {
    if (transaction.signers.length === 0) {
      return "";
    } else if (
      transaction.signers.length === 1 &&
      isValidAddress(transaction.signers[0])
    ) {
      return transaction.signers[0];
    }
  }

  return algosdk.encodeAddress(transaction.txn.from.publicKey);
}

function isSingleAuthTransaction(transaction: Transaction) {
  return (
    transaction &&
    transaction.type === "pay" &&
    (transaction.amount === 0 || transaction.amount === undefined)
  );
}

function isAllTransactionsEmpty(transactions: Transaction[]) {
  return transactions.every(isSingleAuthTransaction);
}

function isAlgoTransferTransaction(transaction: Transaction) {
  return Boolean(!transaction.assetIndex && transaction.amount);
}

function transactionHasRekey(transaction: Transaction) {
  return Boolean(transaction.reKeyTo);
}

function transactionHasCloseRemainder(transaction: Transaction) {
  return Boolean(transaction.closeRemainderTo);
}

function checkAuthAddressesIsValid(authAddresses: string[]) {
  return authAddresses.every((address) => algosdk.isValidAddress(address));
}

function transactionHasClearState(transaction: Transaction) {
  return transaction.appOnComplete === OnApplicationComplete.ClearStateOC;
}

function isTransactionDeleteAssetConfig(transaction: Transaction) {
  return (
    checkTransactionAssetParamsEmpty(transaction) &&
    transaction.assetIndex &&
    transaction.type === "acfg"
  );
}

function isTransactionUpdateAssetConfig(transaction: Transaction) {
  return (
    !checkTransactionAssetParamsEmpty(transaction) &&
    transaction.assetIndex &&
    transaction.type === "acfg"
  );
}

function isTransactionCreateAssetConfig(transaction: Transaction) {
  return !transaction.assetIndex && transaction.type === "acfg";
}

function checkTransactionAssetParamsEmpty(transaction: Transaction) {
  return (
    transaction.assetClawback === undefined &&
    transaction.assetDecimals === undefined &&
    transaction.assetDefaultFrozen === undefined &&
    transaction.assetFreeze === undefined &&
    transaction.assetManager === undefined &&
    transaction.assetMetadataHash === undefined &&
    transaction.assetName === undefined &&
    transaction.assetReserve === undefined &&
    transaction.assetTotal === undefined &&
    transaction.assetUnitName === undefined
  );
}

/**
 * Verify that all transactions in a group have the same
 * group ID and there are no missing transactions
 *
 * @param {Transaction[]} transactions Transaction[]
 * @throws {Error} If the group ID is not the same for all transactions or if there's no transactions
 * @returns {boolean} boolean
 */
function verifyTransactionsGroupID(transactions: Transaction[]) {
  // If there are no transactions, we can't verify the group ID
  if (transactions.length === 0) {
    throw new Error("Transaction group has 0 items");
  }

  // Memorize the first group ID to compare with the rest
  const firstTransactionGroupID = transactions[0].group;

  // A group of size 1 may have an empty group ID
  if (transactions.length === 1 && firstTransactionGroupID === undefined) {
    return true;
  }

  for (let i = 0; i < transactions.length; i++) {
    // Pass the first transaction, since we already have its group ID
    // To have a valid comparison, group IDs shouldn't be undefined
    // Check if the group ID is the same as the first transaction's group ID
    if (
      i > 0 &&
      (transactions[i].group === undefined ||
        firstTransactionGroupID === undefined ||
        uint8ArrayToBase64(transactions[i].group!) !==
          uint8ArrayToBase64(firstTransactionGroupID!))
    ) {
      throw new Error("Transaction group has multiple group IDs");
    }

    // Reset group IDs so we can compute it again
    transactions[i].group = undefined;
  }

  // Compute the group ID again
  const computedGroupID = algosdk.computeGroupID(transactions);

  return (
    // Compare it with the first transaction's group ID
    uint8ArrayToBase64(computedGroupID) === uint8ArrayToBase64(firstTransactionGroupID!)
  );
}

/**
 * Groups transactions by group ID
 * @param {transaction[]} transactions Transaction[]
 * @returns {Transaction[][]} Transaction[][]
 */
function getTransactionGroups(transactions: Transaction[]) {
  return transactions.reduce((grouped, transaction) => {
    if (transaction.group) {
      const groupID = uint8ArrayToBase64(transaction.group);
      const groupIndex = grouped.findIndex(
        (group) =>
          group.length > 0 &&
          group[0].group &&
          uint8ArrayToBase64(group[0].group) === groupID
      );

      if (groupIndex === -1) {
        grouped.push([transaction]);
      } else {
        grouped[groupIndex].push(transaction);
      }
    } else {
      grouped.push([transaction]);
    }

    return grouped;
  }, [] as Transaction[][]);
}

/**
 * Check if a transaction group has an invalid group ID
 * @param {string[]} base64 encoded Transaction[]
 * @returns {boolean}
 */
function hasInvalidGroupOnTransactions(transactions: string[]) {
  const decodedTransactions = transactions.map((transaction) =>
    algosdk.decodeUnsignedTransaction(base64ToUint8Array(transaction))
  );
  const transactionGroups = getTransactionGroups(decodedTransactions);

  return transactionGroups.some((txnGroup) => !verifyTransactionsGroupID(txnGroup));
}

export {
  getTransactionTypeCounts,
  getTransactionTypeCountTexts,
  getTransactionTypeText,
  checkIfTransactionIsReceive,
  getTransactionType,
  seperateTransactionReceiveAndSpend,
  getAssetIndexesFromTransactions,
  checkIfTransactionSignedBySomebodyElse,
  checkIfTransactionOptIn,
  checkIfTransactionApplicationCall,
  getOptInTransactions,
  getApplicationCallTransactions,
  isCreateApplicationTransaction,
  isTransactionTypeSupported,
  checkIfTransactionNetworkIsMatches,
  checkIfSignRequiredForTransactions,
  checkIfSignRequiredForTransaction,
  isSingleAuthTransaction,
  isAlgoTransferTransaction,
  transactionHasRekey,
  transactionHasCloseRemainder,
  checkAuthAddressesIsValid,
  transactionHasClearState,
  getSignerAddress,
  checkIfTransactionAssetConfig,
  isTransactionDeleteAssetConfig,
  isTransactionUpdateAssetConfig,
  isTransactionCreateAssetConfig,
  isAllTransactionsEmpty,
  verifyTransactionsGroupID,
  hasInvalidGroupOnTransactions,
  getTransactionGroups
};

/* eslint-enable max-lines */
