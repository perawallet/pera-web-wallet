import {ReactComponent as ArrowLeft} from "../../../../../../core/ui/icons/arrow-left.svg";

import "./_transaction-sign-detail-raw-view.scss";

import algosdk from "algosdk";

import Button from "../../../../../../component/button/Button";
import {useTransactionSignFlowContext} from "../../../../../context/TransactionSignFlowContext";
import ClipboardButton from "../../../../../../component/clipboard/button/ClipboardButton";

function TransactionSignDetailRawView() {
  const {
    formitoState: {activeTransactionIndex, txns},
    dispatchFormitoAction: dispatchTransactionPageAction
  } = useTransactionSignFlowContext();
  const {txn} = txns[activeTransactionIndex];
  const encodedTransaction = txn.get_obj_for_encoding();

  Object.keys(encodedTransaction).forEach((key) => {
    if (key === "snd" || key === "rcv") {
      // @ts-ignore ts-2322
      encodedTransaction[key] = algosdk.encodeAddress(encodedTransaction[key]);
    }
  });

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
          textToCopy={JSON.stringify(encodedTransaction)}>
          {"Copy"}
        </ClipboardButton>
      </div>

      <div className={"transaction-sign-detail-raw-view__raw-transaction"}>
        <code>{JSON.stringify(encodedTransaction)}</code>
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
