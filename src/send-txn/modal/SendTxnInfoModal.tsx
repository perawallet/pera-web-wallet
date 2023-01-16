import "./_send-txn-info-modal.scss";

import {ReactComponent as InfoIcon} from "../../core/ui/icons/info.svg";

import InfoModal from "../../component/info-modal/InfoModal";
import {STORED_KEYS} from "../../core/util/storage/web/webStorage";
import {
  SEND_TXN_INFO_MODAL_ID,
  SEND_TXN_INFO_MODAL_TIPS
} from "../page/send-txn/sendTxnConstants";

function SendTxnInfoModal({
  displayDontShowAgain = false
}: {
  displayDontShowAgain?: boolean;
}) {
  return (
    <InfoModal
      modalId={SEND_TXN_INFO_MODAL_ID}
      customClassName={"send-txn__info-modal"}
      iconHeader={<InfoIcon className={"send-txn__header-icon"} width={56} height={56} />}
      title={"Send Transaction"}
      infoItems={SEND_TXN_INFO_MODAL_TIPS}
      confirmationText={"I understand"}
      displayDontShowAgain={
        displayDontShowAgain
          ? {
              webStorageKey: STORED_KEYS.HIDE_SEND_TXN_INFO_MODAL
            }
          : undefined
      }
      footer={
        <div className={"typography--secondary-body text-color--main"}>
          {"For more information on transacting, "}

          <a
            href={
              "https://support.perawallet.app/en/article/sending-a-basic-transaction-1fzxcfw/"
            }
            target={"_blank"}
            rel={"noreferrer"}
            className={"send-txn__info-modal-link typography--secondary-bold-body"}>
            {" visit here →"}
          </a>
        </div>
      }
    />
  );
}

export default SendTxnInfoModal;
