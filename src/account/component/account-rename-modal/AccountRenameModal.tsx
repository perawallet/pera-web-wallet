import "./_account-rename-modal.scss";

import Button from "../../../component/button/Button";
import AccountNameForm from "../account-name-form/AccountNameForm";
import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import {usePortfolioContext} from "../../../overview/context/PortfolioOverviewContext";

interface AccountRenameModalProps {
  account: AppDBAccount;
}

export const ACCOUNT_RENAME_MODAL_ID = "account-rename-modal";

function AccountRenameModal({account}: AccountRenameModalProps) {
  const {renameAccount} = usePortfolioContext()!;
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
        buttonType={"light"}
        size={"large"}
        customClassName={"account-rename-modal__cancel-cta"}
        onClick={handleCancelClick}>
        {"Cancel"}
      </Button>
    </div>
  );

  async function handleRenameAccountSubmit(accountName: string) {
    await renameAccount(account.address, accountName);

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
