import {ReactComponent as AddFundsIcon} from "../../core/ui/icons/add-funds.svg";
import {ReactComponent as PlusIcon} from "../../core/ui/icons/plus.svg";

import "./_add-funds-button.scss";

import classNames from "classnames";

import Button, {ButtonProps} from "../../component/button/Button";
import {useModalDispatchContext} from "../../component/modal/context/ModalContext";
import {usePortfolioContext} from "../../overview/context/PortfolioOverviewContext";
import AddFundsAccountSelectModal, {
  ADD_FUNDS_ACCOUNT_SELECT_MODAL_ID
} from "../account-select/AddFundsAccountSelectModal";
import useAddFunds from "../../core/util/hook/useAddFunds";
import {useAppContext} from "../../core/app/AppContext";
import {useSimpleToaster} from "../../component/simple-toast/util/simpleToastHooks";

export type AddFundsButtonProps = Pick<
  ButtonProps,
  "buttonType" | "size" | "customClassName"
> & {
  accountAddress?: string;
};

function AddFundsButton({
  accountAddress,
  customClassName,
  buttonType = "primary",
  size
}: AddFundsButtonProps) {
  const {
    state: {preferredNetwork}
  } = useAppContext();
  const dispatchModalStateAction = useModalDispatchContext();
  const {open: openAddFundsModal} = useAddFunds();
  const portfolioOverview = usePortfolioContext();
  const simpleToaster = useSimpleToaster();

  return (
    <Button
      customClassName={classNames("add-funds-button", customClassName)}
      onClick={handleOnClickAddFundsButton}
      buttonType={buttonType}
      size={size}>
      {buttonType === "primary" ? (
        <PlusIcon />
      ) : (
        <AddFundsIcon className={"add-funds-button__add-funds-icon"} />
      )}

      {"Add Funds"}
    </Button>
  );

  function handleOnClickAddFundsButton() {
    if (preferredNetwork !== "mainnet") {
      simpleToaster.display({
        type: "error",
        message: `You cannot purchase while on ${preferredNetwork}. Please switch back to MainNet from Settings to use Pera Onramp.`
      });

      return;
    }

    if (accountAddress) {
      openAddFundsModal(accountAddress);
    } else {
      dispatchModalStateAction({
        type: "OPEN_MODAL",
        payload: {
          item: {
            id: ADD_FUNDS_ACCOUNT_SELECT_MODAL_ID,
            modalContentLabel: "Select account",
            customClassName: "add-funds-account-select-modal-container",
            children: (
              <AddFundsAccountSelectModal
                accounts={Object.values(portfolioOverview!.accounts)}
              />
            )
          }
        }
      });
    }
  }
}

export default AddFundsButton;
