import "./_backup-info-modal.scss";

import {ReactComponent as BackupIcon} from "../../../../core/ui/icons/backup.svg";

import {useNavigate} from "react-router-dom";

import ROUTES from "../../../../core/route/routes";
import webStorage, {STORED_KEYS} from "../../../../core/util/storage/web/webStorage";
import {BACKUP_INFO_MODAL_ID, BACKUP_INFO_MODAL_TIPS} from "./backupInfoModalConstants";
import {useModalDispatchContext} from "../../../../component/modal/context/ModalContext";
import PasswordAccessPage, {
  PASSWORD_ACCESS_MODAL_ID
} from "../../../../password/page/access/PasswordAccessPage";
import InfoModal from "../../../../component/info-modal/InfoModal";

function BackupInfoModal() {
  const navigate = useNavigate();
  const dispatchModalStateAction = useModalDispatchContext();
  const shouldHideTransferInfoModal = webStorage.local.getItem(
    STORED_KEYS.HIDE_BACKUP_INFO_MODAL
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
    <div className={"backup-modal"}>
      <div className={"backup-modal__icon-wrapper"}>
        <BackupIcon width={56} height={56} className={"backup-modal__icon"} />
      </div>

      <h2 className={"backup-modal__title typography--h2"}>{"Algorand Secure Backup"}</h2>

      <div className={"typography--body backup-modal__description text-color--gray"}>
        <p>
          {
            "Backup your accounts using the Algorand Secure backup protocol. You will generate an encrypted text file representing your accounts and a 12-word key used to decrypt them in future."
          }
        </p>

        <a
          href={
            "https://support.perawallet.app/en/article/algorand-secure-backup-1m0zrg9/"
          }
          target={"_blank"}
          rel={"noopener noreferrer"}>
          {"Learn more"}
        </a>
      </div>

      <InfoModal
        modalId={BACKUP_INFO_MODAL_ID}
        onConfirm={handleStartBackup}
        // TODO fix this classname
        customClassName={"backup-modal__info-box"}
        infoItems={BACKUP_INFO_MODAL_TIPS}
        confirmationText={"I understand, proceed"}
        displayDontShowAgain={{
          webStorageKey: STORED_KEYS.HIDE_TRANSFER_MOBILE_INFO_MODAL
        }}
      />
    </div>
  );

  function handleStartBackup() {
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

    navigate(ROUTES.SETTINGS.BACKUP.FULL_PATH);
  }
}

export default BackupInfoModal;
