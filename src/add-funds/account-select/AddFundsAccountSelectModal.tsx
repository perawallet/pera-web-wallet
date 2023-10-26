import {ReactComponent as ArrowLeftIcon} from "../../core/ui/icons/arrow-left.svg";

import "./_add-funds-account-select-modal.scss";

import SearchableAccountList from "../../account/component/list/searchable/SearchableAccountList";
import Button from "../../component/button/Button";
import {useModalDispatchContext} from "../../component/modal/context/ModalContext";
import useAddFunds from "../../core/util/hook/useAddFunds";

export const ADD_FUNDS_ACCOUNT_SELECT_MODAL_ID = "account-overview-add-funds-modal-id";

interface AccountOverviewAddFundsModalProps {
  accounts: AccountOverview[];
}

function AddFundsAccountSelectModal({accounts}: AccountOverviewAddFundsModalProps) {
  const dispatchModalStateAction = useModalDispatchContext();
  const {open: openAddFundsModal} = useAddFunds();

  return (
    <div className={"add-funds-account-select-modal"}>
      <div className={"add-funds-account-select-modal__go-back-button-container"}>
        <Button
          onClick={closeSelectAccountModal}
          buttonType={"custom"}
          customClassName={"add-funds-account-select-modal__go-back-button"}>
          <ArrowLeftIcon
            className={"add-funds-account-select-modal__go-back-button-icon"}
          />
        </Button>

        <h2 className={"typography--h3 text-color--main"}>{"Select account"}</h2>
      </div>

      <SearchableAccountList
        hasBackgroundColor={false}
        accounts={accounts}
        onSelectAccount={handleSelectAccount}
      />
    </div>
  );

  function handleSelectAccount(address: string) {
    closeSelectAccountModal();

    openAddFundsModal(address);
  }

  function closeSelectAccountModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {id: ADD_FUNDS_ACCOUNT_SELECT_MODAL_ID}
    });
  }
}

export default AddFundsAccountSelectModal;
