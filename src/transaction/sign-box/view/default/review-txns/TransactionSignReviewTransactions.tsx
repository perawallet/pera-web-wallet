import {ReactComponent as ChevronRight} from "../../../../../core/ui/icons/chevron-right.svg";

import "./_transaction-sign-review-transactions.scss";

import Button from "../../../../../component/button/Button";
import {useTransactionSignFlowContext} from "../../../../context/TransactionSignFlowContext";
import {
  checkIfSignRequiredForTransactions,
  isAllTransactionsEmpty,
  seperateTransactionReceiveAndSpend
} from "../../../../utils/transactionUtils";
import TransactionSignAssetsList from "./asset-list/TransactionSignAssetsList";
import TransactionSignDetailMessage from "../../../message/TransactionSignDetailMessage";

function TransactionSignReviewTransactions() {
  const {
    formitoState: {txns, userAddress, currentSession},
    dispatchFormitoAction: dispatchTransactionPageAction
  } = useTransactionSignFlowContext();
  const {
    signedBySomebodyElseTransactions,
    receiveTransactions,
    spendTransactions,
    optInTransactions,
    applicationCallTransactions,
    assetConfigTransactions
  } = seperateTransactionReceiveAndSpend(txns, userAddress);
  const transactions = txns.map((txn) => txn.txn);

  return (
    <div className={"transaction-sign-review-transactions"}>
      <div className={"transaction-sign-review-transactions__title-wrapper"}>
        <h2 className={"typography--subhead transaction-sign-review-transactions__title"}>
          {"Summary"}
        </h2>

        <Button
          onClick={handleChangeView}
          customClassName={"transaction-sign-review-transactions__button"}
          buttonType={"custom"}>
          {txns.length === 1
            ? "Transaction Details"
            : `Transaction breakdown (${txns.length})`}

          <ChevronRight />
        </Button>
      </div>

      <div>
        {receiveTransactions.length > 0 && (
          <TransactionSignAssetsList
            transactions={receiveTransactions}
            title={"You will receive"}
            type={"receive"}
          />
        )}

        {spendTransactions.length > 0 && (
          <TransactionSignAssetsList
            transactions={spendTransactions}
            title={"You will spend"}
            type={"spend"}
          />
        )}

        {optInTransactions.length > 0 && (
          <TransactionSignAssetsList
            transactions={optInTransactions}
            title={"Opt-In Transactions"}
            type={"opt-in"}
          />
        )}

        {applicationCallTransactions.length > 0 && (
          <TransactionSignAssetsList
            transactions={applicationCallTransactions}
            title={"Application Calls"}
            type={"app-call"}
          />
        )}

        {signedBySomebodyElseTransactions.length > 0 && (
          <TransactionSignAssetsList
            transactions={signedBySomebodyElseTransactions}
            title={"Signed by other parties"}
            type={"signed-by-others"}
          />
        )}

        {assetConfigTransactions.length > 0 && (
          <TransactionSignAssetsList
            transactions={assetConfigTransactions}
            title={"Asset Configurations"}
            type={"asset-config"}
          />
        )}
      </div>

      <div className={"transaction-sign-review-transactions__message"}>
        {!checkIfSignRequiredForTransactions(txns, currentSession!) && (
          <TransactionSignDetailMessage
            message={
              "Your signature is not required for these transactions. Please contact the dApp developer for more information."
            }
            type={"info"}
          />
        )}

        {isAllTransactionsEmpty(transactions) && (
          <TransactionSignDetailMessage
            message={
              "You will not receive anything from this transaction. Sometimes dApps use empty transactions for authorization or instructions via the note field."
            }
            type={"info"}
          />
        )}
      </div>
    </div>
  );

  function handleChangeView() {
    dispatchTransactionPageAction({
      type: "SET_FORM_VALUE",
      payload: {
        transactionSignView: "txn-detail-summary"
      }
    });
  }
}

export default TransactionSignReviewTransactions;
