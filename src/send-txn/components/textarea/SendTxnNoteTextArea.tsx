import "./_send-txn-note-textarea.scss";

import {SyntheticEvent} from "react";
import {FormField, Textarea} from "@hipo/react-ui-toolkit";

import {useSendTxnFlowContext} from "../../context/SendTxnFlowContext";

function SendTxnNoteTextArea() {
  const {formitoState, dispatchFormitoAction} = useSendTxnFlowContext();

  return (
    <FormField label={"Note"} customClassName={"send-txn-note__form-field"}>
      <Textarea
        value={formitoState.txnNote}
        onChange={handleTextAreaChange}
        name={"txnNote"}
        placeholder={"Write an optional message"}
      />
    </FormField>
  );

  function handleTextAreaChange(event: SyntheticEvent<HTMLTextAreaElement>) {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        [event?.currentTarget.name]: event?.currentTarget.value
      }
    });
  }
}

export default SendTxnNoteTextArea;
