import "./_transfer-mobile-info-modal.scss";

import {ReactComponent as PeraTransferIcon} from "../../../core/ui/icons/pera-transfer.svg";

import {useNavigate} from "react-router-dom";

import ROUTES from "../../../core/route/routes";
import InfoModal from "../../../component/info-modal/InfoModal";
import webStorage, {STORED_KEYS} from "../../../core/util/storage/web/webStorage";
import {
  TRANSFER_MOBILE_INFO_MODAL_ID,
  TRANSFER_MOBILE_INFO_MODAL_TIPS
} from "./transferMobileInfoModalConstants";
import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";
import PasswordAccessPage, {
  PASSWORD_ACCESS_MODAL_ID
} from "../../../password/page/access/PasswordAccessPage";

function TransferMobileInfoModal() {
  const navigate = useNavigate();
  const dispatchModalStateAction = useModalDispatchContext();
  const shouldHideTransferInfoModal = webStorage.local.getItem(
    STORED_KEYS.HIDE_TRANSFER_MOBILE_INFO_MODAL
  );

  if (shouldHideTransferInfoModal) {
    return (
      <PasswordAccessPage
        type={"modal"}
        onSubmit={handleRoute}
        title={"Enter Passcode"}
        ctaText={"Proceed"}
        hasCancelButton={true}
        onCancel={handleCloseModals}
      />
    );
  }

  return (
    <div className={"transfer-mobile"}>
      <PeraTransferIcon className={"transfer-mobile__icon"} />

      <h2 className={"transfer-mobile__title typography--h2"}>
        {"Transfer your accounts to"}

        <br />

        {"Pera Mobile"}
      </h2>

      <InfoModal
        modalId={TRANSFER_MOBILE_INFO_MODAL_ID}
        onConfirm={handleStartTransferMobile}
        // TODO fix this classname
        customClassName={"asset-optin-page__info-modal"}
        infoItems={TRANSFER_MOBILE_INFO_MODAL_TIPS}
        confirmationText={"I understand, proceed"}
        displayDontShowAgain={{
          webStorageKey: STORED_KEYS.HIDE_TRANSFER_MOBILE_INFO_MODAL
        }}
      />
    </div>
  );

  function handleStartTransferMobile() {
    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: PASSWORD_ACCESS_MODAL_ID,
          modalContentLabel: "Transfer Accounts Confirmation",
          children: (
            <PasswordAccessPage
              type={"modal"}
              onSubmit={handleRoute}
              title={"Enter Passcode"}
              ctaText={"Proceed"}
              hasCancelButton={true}
              onCancel={handleCloseModals}
            />
          )
        }
      }
    });
  }

  function handleCloseModals() {
    dispatchModalStateAction({type: "CLOSE_ALL_MODALS"});
  }

  function handleRoute() {
    handleCloseModals();

    navigate(ROUTES.SETTINGS.TRANSFER_MOBILE.FULL_PATH);
  }
}

export default TransferMobileInfoModal;
