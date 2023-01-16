import "./_send-txn.scss";

import {ReactComponent as InfoIcon} from "../../../core/ui/icons/info.svg";

import {useEffect, useCallback} from "react";

import Button from "../../../component/button/Button";
import SendTxnForm from "../../components/form/SendTxnForm";
import {SEND_TXN_INFO_MODAL_ID} from "./sendTxnConstants";
import {useSendTxnFlowContext} from "../../context/SendTxnFlowContext";
import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";
import SendTxnInfoModal from "../../modal/SendTxnInfoModal";
import useSetPageTitle from "../../../core/util/hook/useSetPageTitle";

function SendTxn() {
  const {
    formitoState: {hideSendTxnInfoModal},
    dispatchFormitoAction
  } = useSendTxnFlowContext();
  const dispatchModalStateAction = useModalDispatchContext();

  const handleOpenInfoModal = useCallback(
    ({displayDontShowAgain = false}) => {
      dispatchModalStateAction({
        type: "OPEN_MODAL",
        payload: {
          item: {
            id: SEND_TXN_INFO_MODAL_ID,
            modalContentLabel: "Send Transaction Information Modal",
            children: <SendTxnInfoModal displayDontShowAgain={displayDontShowAgain} />
          }
        }
      });
    },
    [dispatchModalStateAction]
  );

  useEffect(() => {
    if (hideSendTxnInfoModal) return;

    // store it in the state, only show it in the beginning of the flow
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {hideSendTxnInfoModal: true}
    });

    handleOpenInfoModal({displayDontShowAgain: true});
  }, [dispatchFormitoAction, handleOpenInfoModal, hideSendTxnInfoModal]);

  useSetPageTitle("Send");

  return (
    <div className={"send-txn"}>
      <div className={"send-txn__heading align-center--vertically"}>
        <h2 className={"typography--h2 text-color--main"}>{"Send"}</h2>

        <Button buttonType={"ghost"} size={"small"} onClick={handleOpenInfoModal}>
          <InfoIcon width={20} height={20} />
        </Button>
      </div>

      <SendTxnForm />
    </div>
  );
}

export default SendTxn;
