import "./_account-rename-modal.scss";

import Button from "../../../component/button/Button";
import AccountNameForm from "../account-name-form/AccountNameForm";
import {useAppContext} from "../../../core/app/AppContext";
import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import {appDBManager} from "../../../core/app/db";

interface AccountRenameModalProps {
  account: AppDBAccount;
}

export const ACCOUNT_RENAME_MODAL_ID = "account-rename-modal";

function AccountRenameModal({account}: AccountRenameModalProps) {
  const {
    state: {masterkey},
    dispatch: dispatchAppState
  } = useAppContext();
  const dispatchModalStateAction = useModalDispatchContext();
  const simpleToaster = useSimpleToaster();

  return (
    <div className={"account-rename-modal"}>
      <h2 className={"typography--h2 text-color--main account-rename-modal__title"}>
        {"Name your account"}
      </h2>

      <AccountNameForm
        currentName={account.name}
        ctaText={"Apply"}
        onFormSubmit={handleRenameAccountSubmit}
      />

      <Button
        buttonType={"ghost"}
        size={"large"}
        customClassName={"account-rename-modal__cancel-cta"}
        onClick={handleCancelClick}>
        {"Cancel"}
      </Button>
    </div>
  );

  async function handleRenameAccountSubmit(accountName: string) {
    const {address, pk, date} = account;

    const renamedAccount = {
      type: "standard" as AccountType,
      name: accountName,
      address,
      pk,
      date
    };

    await appDBManager.set("accounts", masterkey!)(address, renamedAccount);

    dispatchAppState({type: "SET_ACCOUNT", account: renamedAccount});

    closeModal();

    simpleToaster.display({
      message: "Account name changed",
      type: "success"
    });
  }

  function handleCancelClick() {
    closeModal();
  }

  function closeModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {
        id: ACCOUNT_RENAME_MODAL_ID
      }
    });
  }
}

export default AccountRenameModal;
