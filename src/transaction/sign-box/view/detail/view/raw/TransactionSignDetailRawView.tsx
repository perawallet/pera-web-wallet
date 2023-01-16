import {ReactComponent as ArrowLeft} from "../../../../../../core/ui/icons/arrow-left.svg";

import "./_transaction-sign-detail-raw-view.scss";

import Button from "../../../../../../component/button/Button";
import {useTransactionSignFlowContext} from "../../../../../context/TransactionSignFlowContext";
import ClipboardButton from "../../../../../../component/clipboard/button/ClipboardButton";

function TransactionSignDetailRawView() {
  const {
    formitoState: {activeTransactionIndex, txns},
    dispatchFormitoAction: dispatchTransactionPageAction
  } = useTransactionSignFlowContext();
  const {txn} = txns[activeTransactionIndex];

  return (
    <div>
      <div className={"transaction-sign-detail-raw-view__header"}>
        <Button
          customClassName={"transaction-sign-detail-raw-view__header__back-button"}
          buttonType={"custom"}
          onClick={handleChangeView}>
          <ArrowLeft />
        </Button>

        <h1 className={"typography--subhead"}>{"Raw Transaction"}</h1>

        <ClipboardButton
          customClassName={"transaction-sign-detail-raw-view__header__copy-button"}
          buttonType={"custom"}
          textToCopy={`${txn}`}>
          {"Copy"}
        </ClipboardButton>
      </div>

      <div className={"transaction-sign-detail-raw-view__raw-transaction"}>
        <code>{`${txn}`}</code>
      </div>
    </div>
  );

  function handleChangeView() {
    dispatchTransactionPageAction({
      type: "SET_FORM_VALUE",
      payload: {
        transactionSignView: "txn-detail-single"
      }
    });
  }
}

export default TransactionSignDetailRawView;
