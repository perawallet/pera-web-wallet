import {ReactComponent as ArrowLeftIcon} from "../../../../core/ui/icons/arrow-left.svg";

import "./_account-overview-add-funds-modal.scss";

import SearchableAccountList from "../../../../account/component/list/searchable/SearchableAccountList";
import Button from "../../../../component/button/Button";
import {useModalDispatchContext} from "../../../../component/modal/context/ModalContext";
import MoonPayModal, {
  MOON_PAY_MODAL_ID
} from "../../../../core/integrations/moon-pay/modal/MoonPayModal";

export const ACCOUNT_OVERVIEW_ADD_FUNDS_MODAL_ID = "account-overview-add-funds-modal-id";

interface AccountOverviewAddFundsModalProps {
  accounts: AccountOverview[];
}

function AccountOverviewAddFundsModal({accounts}: AccountOverviewAddFundsModalProps) {
  const dispatchModalStateAction = useModalDispatchContext();

  return (
    <div className={"account-overview-add-funds-modal"}>
      <div className={"account-overview-add-funds-modal__go-back-button-container"}>
        <Button
          onClick={handleClose}
          buttonType={"custom"}
          customClassName={"account-overview-add-funds-modal__go-back-button"}>
          <ArrowLeftIcon />
        </Button>

        <h2 className={"typography--h2 text-color--main"}>{"Select account"}</h2>
      </div>

      <SearchableAccountList accounts={accounts} onSelectAccount={handleSelectAccount} />
    </div>
  );

  function handleSelectAccount(address: string) {
    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: MOON_PAY_MODAL_ID,
          modalContentLabel: "Add funds via Moonpay",
          customClassName: "moon-pay-modal-container",
          children: <MoonPayModal address={address} onClose={handleCloseMoonPayModal} />
        }
      }
    });

    closeSelectAccountModal();
  }

  function closeSelectAccountModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {id: ACCOUNT_OVERVIEW_ADD_FUNDS_MODAL_ID}
    });
  }

  function handleCloseMoonPayModal() {
    dispatchModalStateAction({type: "CLOSE_MODAL", payload: {id: MOON_PAY_MODAL_ID}});
  }

  function handleClose() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {id: ACCOUNT_OVERVIEW_ADD_FUNDS_MODAL_ID}
    });
  }
}

export default AccountOverviewAddFundsModal;
