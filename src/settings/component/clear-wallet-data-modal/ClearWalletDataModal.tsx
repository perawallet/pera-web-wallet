import "./_clear-wallet-data-modal.scss";

import Button from "../../../component/button/Button";
import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";
import useFormito from "../../../core/util/hook/formito/useFormito";
import PasswordAccessPage, {
  PASSWORD_ACCESS_MODAL_ID
} from "../../../password/page/access/PasswordAccessPage";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import ClearWalletDataModalConfirmationView from "./view/confirmation/ClearWalletDataModalConfirmationView";
import ClearWalletDataModalBackupView from "./view/backup/ClearWalletDataModalBackupView";
import {appDBManager} from "../../../core/app/db";
import webStorage, {STORED_KEYS} from "../../../core/util/storage/web/webStorage";

export const CLEAR_WALLET_DATA_MODAL_ID = "clear-wallet-data-modal";

function ClearWalletDataModal() {
  const dispatchModalStateAction = useModalDispatchContext();
  const simpleToaster = useSimpleToaster();
  const {
    formitoState: {modalView},
    dispatchFormitoAction
  } = useFormito({modalView: "backup-view"});

  return (
    <div className={"align-center--vertically has-space-between clear-wallet-data-modal"}>
      {renderView()}

      <Button
        buttonType={"ghost"}
        size={"large"}
        onClick={closeClearWalletDataModal}
        customClassName={"clear-wallet-data-modal__cancel-cta"}>
        {"Cancel"}
      </Button>
    </div>
  );

  function renderView() {
    let view;

    if (modalView === "backup-view") {
      view = <ClearWalletDataModalBackupView onBackedUpClick={handleBackedUpClick} />;
    } else {
      view = <ClearWalletDataModalConfirmationView onSubmit={handleConfirmationClick} />;
    }

    return view;
  }

  function handleBackedUpClick() {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        modalView: "confirmation-view"
      }
    });
  }

  function handleConfirmationClick() {
    closeClearWalletDataModal();

    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: PASSWORD_ACCESS_MODAL_ID,
          modalContentLabel: "Remove Account Confirmation",
          children: (
            <PasswordAccessPage
              title={"Enter passcode"}
              description={"Enter your passcode to clear wallet data"}
              ctaText={"Clear Wallet Data"}
              ctaType={"danger"}
              hasCancelButton={true}
              onSubmit={handleClearWalletDataSubmit}
              onCancel={closePasswordAccessModal}
            />
          )
        }
      }
    });
  }

  function closeClearWalletDataModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {
        id: CLEAR_WALLET_DATA_MODAL_ID
      }
    });
  }

  function closePasswordAccessModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {
        id: PASSWORD_ACCESS_MODAL_ID
      }
    });
  }

  async function handleClearWalletDataSubmit() {
    try {
      await appDBManager.reset();

      // reset local storage
      for (const key of Object.values(STORED_KEYS)) {
        webStorage.local.removeItem(key);
      }

      location.href = "/";

      closePasswordAccessModal();
    } catch (error) {
      simpleToaster.display({
        message: "Could not clear wallet data. Please try again.",
        type: "error"
      });
    }
  }
}

export default ClearWalletDataModal;
