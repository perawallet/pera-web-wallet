import {ReactComponent as ArrowLeft} from "../../../../../../core/ui/icons/arrow-left.svg";

import "./_transaction-sign-detail-summary-view.scss";

import {useSearchParams} from "react-router-dom";

import {useTransactionSignFlowContext} from "../../../../../context/TransactionSignFlowContext";
import TransactionDetailsList from "../../../../../detail/list/TransactionDetailsList";
import TransactionTypeLabelList from "../../type-labels/TransactionTypeLabelList";
import Button from "../../../../../../component/button/Button";

function TransactionSignDetailSummaryView() {
  const {
    formitoState: {txns, arbitraryData},
    dispatchFormitoAction: dispatchTransactionPageAction
  } = useTransactionSignFlowContext();
  const [searchParams] = useSearchParams();
  const isCompactMode = searchParams.get("compactMode");

  return (
    <div>
      <div className={"transaction-sign-detail-summary-view__header"}>
        <Button
          customClassName={"transaction-sign-detail-summary-view__header__back-button"}
          buttonType={"custom"}
          onClick={handleChangeView}>
          <ArrowLeft />
        </Button>

        <h2
          className={
            isCompactMode ? "typography--bold-body" : "typography--h2"
          }>{`Summary of ${arbitraryData?.data.length || txns.length} Transactions`}</h2>
      </div>

      <TransactionTypeLabelList />

      <TransactionDetailsList />
    </div>
  );

  function handleChangeView() {
    dispatchTransactionPageAction({
      type: "SET_FORM_VALUE",
      payload: {transactionSignView: "default"}
    });
  }
}

export default TransactionSignDetailSummaryView;
