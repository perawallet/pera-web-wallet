import {ReactComponent as UnlinkIcon} from "../../../core/ui/icons/unlink.svg";

import "./_account-remove-modal.scss";

import Button from "../../../component/button/Button";
import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";
import {useAppContext} from "../../../core/app/AppContext";
import PasswordAccessPage, {
  PASSWORD_ACCESS_MODAL_ID
} from "../../../password/page/access/PasswordAccessPage";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import {appDBManager} from "../../../core/app/db";

interface AccountRemoveModalProps {
  account: AppDBAccount;
}

export const ACCOUNT_REMOVE_MODAL_ID = "remove-account-modal";

function AccountRemoveModal({account}: AccountRemoveModalProps) {
  const {
    state: {masterkey},
    dispatch
  } = useAppContext();
  const dispatchModalStateAction = useModalDispatchContext();
  const simpleToaster = useSimpleToaster();

  return (
    <div>
      <div className={"account-remove-modal__hero"}>
        <div className={"account-remove-modal__hero-unlink-icon-wrapper"}>
          <UnlinkIcon width={48} height={48} />
        </div>

        <h2
          className={"typography--h2 text-color--main account-remove-modal__hero-title"}>
          {"Remove account"}
        </h2>

        <p className={"typography--body text-color--gray"}>
          {"You are about to unlink your account "}
          <span
            className={
              "typography--medium-body text-color--main"
            }>{`"${account.name}"`}</span>
          {
            " from this device. This does not delete the account, but to re-add it in future, you will need to import it again with your 25 word passphrase."
          }
        </p>
      </div>

      <Button
        buttonType={"danger"}
        size={"large"}
        customClassName={"account-remove-modal__confirm-cta"}
        onClick={handleConfirmClick}>
        {"Confirm"}
      </Button>

      <Button
        buttonType={"ghost"}
        size={"large"}
        customClassName={"account-remove-modal__cancel-cta"}
        onClick={handleCancelClick}>
        {"Cancel"}
      </Button>
    </div>
  );

  function handleConfirmClick() {
    closeModal();

    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: PASSWORD_ACCESS_MODAL_ID,
          modalContentLabel: "Remove Account Confirmation",
          children: (
            <PasswordAccessPage
              description={"Enter your passcode to remove account"}
              ctaText={"Remove Account"}
              hasCancelButton={true}
              onSubmit={handlePasswordAccessRemoveAccount}
              onCancel={handleCancelClick}
            />
          )
        }
      }
    });
  }

  async function handlePasswordAccessRemoveAccount() {
    if (!masterkey) return;

    try {
      await appDBManager.delete("accounts")({
        key: account.address,
        encryptionKey: masterkey
      });

      dispatch({
        type: "REMOVE_ACCOUNT",
        address: account.address
      });

      closeModal();

      simpleToaster.display({
        type: "info",
        message: `Account "${account.name}" removed!`
      });
    } catch (error) {
      console.error(error);

      simpleToaster.display({
        type: "error",
        message: `There is an error removing "${account.name}".`
      });
    }
  }

  function handleCancelClick() {
    closeModal();
  }

  function closeModal() {
    dispatchModalStateAction({
      type: "CLOSE_ALL_MODALS"
    });
  }
}

export default AccountRemoveModal;
