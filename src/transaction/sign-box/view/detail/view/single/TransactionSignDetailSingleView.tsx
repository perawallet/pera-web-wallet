import {ReactComponent as ArrowLeft} from "../../../../../../core/ui/icons/arrow-left.svg";

import "./_transaction-sign-detail-single-view.scss";

import {useSearchParams} from "react-router-dom";
import classNames from "classnames";

import {useTransactionSignFlowContext} from "../../../../../context/TransactionSignFlowContext";
import TransactionSignSingleViewWallets from "./wallets/TransactionSignSingleViewWallets";
import TransactionSignDetailWarningMessages from "./messages/TransactionSignDetailWarningMessages";
import TransactionSignDetailList from "./detail-list/TransactionSignDetailList";

function TransactionSignDetailSingleView() {
  const {dispatchFormitoAction: dispatchTransactionPageAction} =
    useTransactionSignFlowContext();
  const [searchParams] = useSearchParams();
  const isCompactMode = searchParams.get("compactMode");

  return (
    <div
      className={classNames("transaction-sign-detail-single-view", {
        "transaction-sign-detail-single-view--compact": isCompactMode
      })}>
      <div className={"transaction-sign-detail-single-view__header"}>
        <ArrowLeft onClick={handleChangeTransactionDetailView} />

        <h1 className={isCompactMode ? "typography--bold-body" : "typography--h2"}>
          {"Transaction Details"}
        </h1>
      </div>

      <TransactionSignSingleViewWallets />

      <TransactionSignDetailWarningMessages />

      <TransactionSignDetailList />
    </div>
  );

  function handleChangeTransactionDetailView() {
    dispatchTransactionPageAction({
      type: "SET_FORM_VALUE",
      payload: {
        transactionSignView: "txn-detail-summary"
      }
    });
  }
}

export default TransactionSignDetailSingleView;
