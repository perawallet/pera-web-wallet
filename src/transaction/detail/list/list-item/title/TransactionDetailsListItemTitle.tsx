import algosdk, {microalgosToAlgos, OnApplicationComplete, Transaction} from "algosdk";
import classNames from "classnames";

import {trimAccountAddress} from "../../../../../account/util/accountUtils";
import {ALGO_UNIT} from "../../../../../core/ui/typography/typographyConstants";
import {integerToFractionDecimal} from "../../../../../core/util/asset/assetUtils";
import {formatNumber} from "../../../../../core/util/number/numberUtils";
import {useTransactionSignFlowContext} from "../../../../context/TransactionSignFlowContext";
import {
  checkIfTransactionApplicationCall,
  checkIfTransactionAssetConfig,
  checkIfTransactionIsReceive,
  checkIfTransactionOptIn,
  getTransactionType,
  isCreateApplicationTransaction,
  isTransactionCreateAssetConfig,
  isTransactionDeleteAssetConfig,
  isTransactionUpdateAssetConfig,
  TransactionTypeCounts
} from "../../../../utils/transactionUtils";

interface TransactionDetailListItemTitleProps {
  transaction: Transaction;
}

const TRANSACTION_TYPE_TITLE_MAP = {
  appl: {transactionTypeText: "Application", type: "", to: "from"},
  axferReceive: {transactionTypeText: "Receive", type: "success", to: "from"},
  axfer: {transactionTypeText: "Transfer", type: "danger", to: "to"},
  pay: {transactionTypeText: "Payment", type: "danger", to: "to"},
  acfg: {transactionTypeText: "Asset Config", type: "danger", to: "from"}
};

function TransactionDetailListItemTitle({
  transaction
}: TransactionDetailListItemTitleProps) {
  const {
    formitoState: {userAddress, transactionAssets, transactionAssetsFromNode}
  } = useTransactionSignFlowContext();
  const toAddress = transaction.to ? algosdk.encodeAddress(transaction.to.publicKey) : "";
  const fromAddress = transaction.from
    ? algosdk.encodeAddress(transaction.from.publicKey)
    : "";

  const transactionType = getTransactionType(transaction, userAddress);
  const {transactionTypeText, to, type} =
    TRANSACTION_TYPE_TITLE_MAP[transactionType as keyof TransactionTypeCounts];
  const isReceiveTransaction = transactionType === "axferReceive";
  const isApplicationCall = checkIfTransactionApplicationCall(transaction);
  const isOptInTransaction = checkIfTransactionOptIn(transaction, userAddress);
  const isAssetConfig = checkIfTransactionAssetConfig(transaction);
  const isReceivePaymentTransaction =
    transaction.type === "pay" && checkIfTransactionIsReceive(transaction, userAddress);
  const amountClassName = classNames({
    "text-color--danger": type === "danger" && !isReceivePaymentTransaction,
    "text-color--success": type === "success" || isReceivePaymentTransaction
  });
  const transactionAssetIndex = transaction.assetIndex;
  const transactionAsset = transactionAssets?.find(
    (asset) => asset.asset_id === transaction.assetIndex
  );
  const transactionAssetFromNode = transactionAssetsFromNode?.find(
    (asset) => asset.index === transaction.assetIndex
  );
  const transactionAddress =
    isReceiveTransaction ||
    isApplicationCall ||
    isReceivePaymentTransaction ||
    isAssetConfig
      ? fromAddress
      : toAddress;

  const transactionAmount = transactionAssetIndex
    ? `${
        formatNumber({maximumFractionDigits: 2})(
          integerToFractionDecimal(
            Number(transaction.amount),
            transactionAsset?.fraction_decimals
          )
        ) || ""
      } ${transactionAsset?.name || transactionAssetFromNode?.params.name}`
    : `${microalgosToAlgos(Number(transaction.amount || ""))}${ALGO_UNIT}`;

  return (
    <div className={"typography--medium-body"}>
      <span>{renderTransactionTypeText()}</span>

      <span className={amountClassName}>{`${
        isApplicationCall || isAssetConfig ? "" : transactionAmount
      }`}</span>

      {to && (
        <span>{` ${isReceivePaymentTransaction ? "from" : to} ${trimAccountAddress(
          transactionAddress
        )}`}</span>
      )}
    </div>
  );

  function renderTransactionTypeText() {
    if (isApplicationCall) {
      if (isCreateApplicationTransaction(transaction)) {
        return "Create Application";
      }

      switch (transaction.appOnComplete) {
        case OnApplicationComplete.OptInOC:
          return `Opt-In to #${transaction.appIndex}`;
        case OnApplicationComplete.CloseOutOC:
          return `Close Out App #${transaction.appIndex}`;
        case OnApplicationComplete.UpdateApplicationOC:
          return `Modify App #${transaction.appIndex}`;
        case OnApplicationComplete.DeleteApplicationOC:
          return `Destroy App #${transaction.appIndex}`;
        default:
          return `#${transaction.appIndex} Application`;
      }
    }

    if (isAssetConfig) {
      if (isTransactionCreateAssetConfig(transaction)) {
        return transaction.assetName
          ? `Create "${transaction.assetName}" Asset`
          : "Create Asset";
      }

      if (isTransactionUpdateAssetConfig(transaction)) {
        return `Modify "${
          transactionAsset?.name || transactionAssetFromNode?.params.name
        }" Asset`;
      }

      if (isTransactionDeleteAssetConfig(transaction)) {
        return `Delete "${
          transactionAsset?.name || transactionAssetFromNode?.params.name
        }" Asset`;
      }
    }

    if (isOptInTransaction) {
      return "Opt-In to";
    }

    return `${transactionTypeText} `;
  }
}

export default TransactionDetailListItemTitle;
