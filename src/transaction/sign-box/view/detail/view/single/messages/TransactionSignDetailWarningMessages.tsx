import algosdk from "algosdk";

import {useTransactionSignFlowContext} from "../../../../../../context/TransactionSignFlowContext";
import {
  checkIfSignRequiredForTransaction,
  isSingleAuthTransaction,
  transactionHasClearState,
  transactionHasCloseRemainder,
  transactionHasRekey
} from "../../../../../../utils/transactionUtils";
import TransactionSignDetailMessage from "../../../../../message/TransactionSignDetailMessage";

function TransactionSignDetailWarningMessages() {
  const {
    formitoState: {txns, activeTransactionIndex, transactionAssets, currentSession}
  } = useTransactionSignFlowContext();
  const activeTransaction = txns[activeTransactionIndex];
  const activeTransactionAsset = transactionAssets?.find(
    (asset) => asset.asset_id === activeTransaction.txn.assetIndex
  );

  return (
    <div className={"transaction-sign-detail-warning-messages"}>
      {isSingleAuthTransaction(activeTransaction.txn) && (
        <TransactionSignDetailMessage
          message={
            "You will not receive anything from this transaction. Sometimes dApps use empty transactions for authorization or instructions via the note field."
          }
          type={"info"}
        />
      )}

      {!checkIfSignRequiredForTransaction(activeTransaction, currentSession!) && (
        <TransactionSignDetailMessage
          message={
            "Your signature is not required for these transactions. Please contact the dApp developer for more information."
          }
          type={"info"}
        />
      )}

      {transactionHasRekey(activeTransaction.txn) && activeTransaction.txn.reKeyTo && (
        <TransactionSignDetailMessage
          message={`This transaction will rekey your account and give complete control to ${algosdk.encodeAddress(
            activeTransaction.txn.reKeyTo.publicKey
          )}. Do not proceed if you don't understand the implications of this action.`}
          type={"warning"}
        />
      )}

      {transactionHasCloseRemainder(activeTransaction.txn) && (
        <TransactionSignDetailMessage
          message={
            activeTransaction.txn.type === "axfer"
              ? `This transaction will remove ${
                  activeTransactionAsset?.name
                } from your account and send your full remaining  ${
                  activeTransactionAsset?.name
                } balance to ${algosdk.encodeAddress(
                  activeTransaction.txn.to.publicKey || ""
                )}.`
              : `This transaction will remove Algo from your account and send your full remaining Algo balance to ${algosdk.encodeAddress(
                  activeTransaction.txn.to.publicKey || ""
                )}`
          }
          type={"warning"}
        />
      )}

      {transactionHasClearState(activeTransaction.txn) && (
        <TransactionSignDetailMessage
          message={
            "This transaction is forcibly clearing your account's state for this application. Any value recorded in local state will be lost."
          }
          type={"warning"}
        />
      )}
    </div>
  );
}

export default TransactionSignDetailWarningMessages;
