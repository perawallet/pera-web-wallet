import {ReactComponent as ChevronRight} from "../../../../../core/ui/icons/chevron-right.svg";

import "./_transaction-sign-review-transactions.scss";

import classNames from "classnames";
import {useSearchParams} from "react-router-dom";
import {List} from "@hipo/react-ui-toolkit";

import Button from "../../../../../component/button/Button";
import {useTransactionSignFlowContext} from "../../../../context/TransactionSignFlowContext";
import {
  checkIfSignRequiredForTransactions,
  isAllTransactionsEmpty,
  seperateTransactionReceiveAndSpend,
  transactionsHaveRekey
} from "../../../../utils/transactionUtils";
import TransactionSignAssetsList from "./asset-list/TransactionSignAssetsList";
import TransactionSignDetailMessage, {
  TransactionSignDetailMessageProps
} from "../../../message/TransactionSignDetailMessage";
import TransactionSignArbitraryDataView from "../../detail/view/arbitrary-data/TransactionSignArbitraryDataView";

function TransactionSignReviewTransactions() {
  const {
    formitoState: {txns, arbitraryData, userAddress, currentSession},
    dispatchFormitoAction: dispatchTransactionPageAction
  } = useTransactionSignFlowContext();
  const {
    signedBySomebodyElseTransactions,
    receiveTransactions,
    spendTransactions,
    optInTransactions,
    applicationCallTransactions,
    assetConfigTransactions,
    keyregTransactions
  } = seperateTransactionReceiveAndSpend(txns, userAddress);
  const transactions = txns.map((txn) => txn.txn);
  const [searchParams] = useSearchParams();
  const isCompactMode = searchParams.get("compactMode");
  const isSignRequiredForTransactions = checkIfSignRequiredForTransactions(
    txns,
    currentSession!
  );

  return (
    <div
      className={classNames("transaction-sign-review-transactions", {
        "transaction-sign-review-transactions--compact": isCompactMode
      })}>
      {renderMessage()}

      {(!arbitraryData || arbitraryData?.data.length !== 1) && (
        <div className={"transaction-sign-review-transactions__title-wrapper"}>
          <h2
            className={"typography--subhead transaction-sign-review-transactions__title"}>
            {"Summary"}
          </h2>

          <Button
            onClick={handleChangeView}
            customClassName={"transaction-sign-review-transactions__button"}
            buttonType={"custom"}>
            {txns.length === 1
              ? "Transaction Details"
              : `Transaction breakdown (${arbitraryData?.data.length || txns.length})`}

            <ChevronRight />
          </Button>
        </div>
      )}

      <div className={"transaction-sign-review-transactions__txns"}>
        {arbitraryData && arbitraryData?.data.length === 1 ? (
          <TransactionSignArbitraryDataView />
        ) : (
          <TransactionSignAssetsList
            transactions={[]}
            title={"Sign requests"}
            type={"arbitrary-data"}
          />
        )}

        {!arbitraryData && (
          <>
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
          </>
        )}
      </div>
    </div>
  );

  function renderMessage() {
    const messages: TransactionSignDetailMessageProps[] = [];

    if (
      transactionsHaveRekey(
        txns.map((txn) => txn.txn),
        userAddress
      )
    ) {
      messages.push({
        message:
          "Your account will be rekeyed, and the rekey address will be authorized.",
        type: "warning"
      });
    }

    if (keyregTransactions && keyregTransactions.length > 0) {
      const isRegisterOnlineTxn = keyregTransactions.find((txn) => !txn.nonParticipation);

      messages.push({
        message: isRegisterOnlineTxn
          ? "By going online, your account will be participating in consensus."
          : "By going offline, your account will no longer participate in consensus.",
        type: "info"
      });
    }

    if (arbitraryData && arbitraryData?.data.length) {
      messages.push({
        message: "You will not spend anything on this action.",
        type: "info"
      });
    }

    if (!isSignRequiredForTransactions) {
      messages.push({
        message:
          "Your signature is not required for these transactions. Please contact the dApp developer for more information.",
        type: "info"
      });
    }

    if (isAllTransactionsEmpty(transactions)) {
      messages.push({
        message:
          "You will not receive anything from this transaction. Sometimes dApps use empty transactions for authorization or instructions via the note field.",
        type: "info"
      });
    }

    return (
      messages.length > 0 && (
        <List items={messages}>
          {(messageItem) => (
            <TransactionSignDetailMessage
              message={messageItem.message}
              type={messageItem.type}
            />
          )}
        </List>
      )
    );
  }

  function handleChangeView() {
    dispatchTransactionPageAction({
      type: "SET_FORM_VALUE",
      payload: {transactionSignView: "txn-detail-summary"}
    });
  }
}

export default TransactionSignReviewTransactions;
