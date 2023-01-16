import {ReactComponent as ArrowLeft} from "../../../../../../core/ui/icons/arrow-left.svg";

import "./_transaction-sign-detail-single-view.scss";

import {useTransactionSignFlowContext} from "../../../../../context/TransactionSignFlowContext";
import TransactionSignSingleViewWallets from "./wallets/TransactionSignSingleViewWallets";
import TransactionSignDetailWarningMessages from "./messages/TransactionSignDetailWarningMessages";
import TransactionSignDetailList from "./detail-list/TransactionSignDetailList";

function TransactionSignDetailSingleView() {
  const {dispatchFormitoAction: dispatchTransactionPageAction} =
    useTransactionSignFlowContext();

  return (
    <div className={"transaction-sign-detail-single-view"}>
      <div className={"transaction-sign-detail-single-view__header"}>
        <ArrowLeft onClick={handleChangeTransactionDetailView} />

        <h1 className={"typography--h2"}>{"Transaction Details"}</h1>
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
