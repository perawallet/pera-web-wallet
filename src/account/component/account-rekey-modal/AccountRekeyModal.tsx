import "./_account-rekey-modal.scss";

import {ReactComponent as RekeyIcon} from "../.../../../../core/ui/icons/rekey.svg";
import {ReactComponent as RekeyDotsIcon} from "../.../../../../core/ui/icons/rekey-dots.svg";
import {ReactComponent as ArrowLeftIcon} from "../.../../../../core/ui/icons/arrow-left.svg";

import {useState} from "react";
import {Spinner} from "@hipo/react-ui-toolkit";

import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";
import webStorage, {STORED_KEYS} from "../../../core/util/storage/web/webStorage";
import InfoModal from "../../../component/info-modal/InfoModal";
import {
  ACCOUNT_REKEY_INFO_MODAL_ID,
  ACCOUNT_REKEY_INFO_MODAL_TIPS,
  ACCOUNT_REKEY_MODAL_ID
} from "./accountRekeyModalConstants";
import SelectableAccountList from "../list/selectable/SelectableAccountList";
import Button from "../../../component/button/Button";
import {getAccountType, trimAccountAddress} from "../../util/accountUtils";
import useTxnSigner from "../../../core/util/hook/useTxnSigner";
import {usePortfolioContext} from "../../../overview/context/PortfolioOverviewContext";
import useAccountIcon from "../../../core/util/hook/useAccountIcon";
import {AccountDropdownOption} from "../../../overview/page/overview/list/account-options-dropdown/accountOptionsDropdownConstants";

export interface AccountRekeyModalProps {
  account: AccountOverview;
  rekeyType: Extract<
    AccountDropdownOption["id"],
    "rekey-undo" | "rekey-standard" | "rekey-ledger"
  >;
}

function AccountRekeyModal({account, rekeyType}: AccountRekeyModalProps) {
  const dispatchModalStateAction = useModalDispatchContext();
  const simpleToaster = useSimpleToaster();
  const shouldDisplayRekeyInfoModal = !webStorage.local.getItem(
    STORED_KEYS.HIDE_REKEY_INFO_MODAL
  );
  const [displayInfoModal, setDisplayInfoModal] = useState(shouldDisplayRekeyInfoModal);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccountAddress, setSelectedAccountAddress] = useState(
    rekeyType === "rekey-undo" ? account.address : ""
  );
  const portfolioOverview = usePortfolioContext();
  const rekeyedToAccount = portfolioOverview!.accounts[selectedAccountAddress!];
  const signer = useTxnSigner();
  const {renderAccountIcon} = useAccountIcon();

  if (!portfolioOverview) {
    return (
      <div className={"account-rekey-modal align-center--horizontally"}>
        <Spinner />
      </div>
    );
  }

  if (displayInfoModal) {
    return (
      <InfoModal
        customClassName={"account-rekey__info-modal"}
        iconHeader={
          <RekeyIcon className={"account-rekey__header-icon"} width={56} height={56} />
        }
        modalId={ACCOUNT_REKEY_INFO_MODAL_ID}
        title={"Rekey Account"}
        subtitle={"Protect your account by delegating signatures to another account."}
        infoItems={ACCOUNT_REKEY_INFO_MODAL_TIPS}
        displayDontShowAgain={{webStorageKey: STORED_KEYS.HIDE_REKEY_INFO_MODAL}}
        confirmationText={"Start Process"}
        onConfirm={handleOpenSelectAccountModal}
      />
    );
  }

  return (
    <div className={"account-rekey-modal"}>
      <div className={"go-back-button-container"}>
        {rekeyType !== "rekey-undo" && selectedAccountAddress && (
          <Button buttonType={"custom"} onClick={resetSelectedAddress}>
            <ArrowLeftIcon />
          </Button>
        )}

        <h2 className={"typography--h2 text-color--main account-rekey-modal__title"}>
          {selectedAccountAddress ? "Confirm Rekeying" : "Select Account"}
        </h2>
      </div>

      {!selectedAccountAddress && (
        <p
          className={
            "typography--body text-color--gray-lighter  account-rekey-modal__subtitle"
          }>
          {"Choose the account you would like to rekey to. "}
          <span className={"typography--bold-body"}>
            {
              "The account you select here will be responsible for signing all transactions for the source account."
            }
          </span>
        </p>
      )}

      {selectedAccountAddress ? (
        <div className={"account-rekey-modal__confirmation-box"}>
          <div className={"account-rekey-modal__confirmation-account"}>
            {renderAccountIcon({account, size: 48})}

            <p className={"typography--secondary-body"}>{account.name}</p>

            <p className={"typography--subhead"}>{trimAccountAddress(account.address)}</p>
          </div>

          <RekeyDotsIcon />

          <div className={"account-rekey-modal__confirmation-account"}>
            {renderAccountIcon({account: rekeyedToAccount, size: 48})}

            <p className={"typography--secondary-body"}>{rekeyedToAccount.name}</p>

            <p className={"typography--subhead"}>
              {trimAccountAddress(rekeyedToAccount.address)}
            </p>
          </div>

          <Button
            size={"large"}
            buttonType={"primary"}
            onClick={handleRekeyingAccount}
            customClassName={"button--fluid"}
            shouldDisplaySpinner={isLoading}>
            {"Finalize Rekeying"}
          </Button>
        </div>
      ) : (
        <SelectableAccountList
          accounts={getRekeyEligibleAccounts()}
          onSelect={handleOnAccountSelect}
          customClassName={"account-rekey__select-list"}
        />
      )}
    </div>
  );

  function getRekeyEligibleAccounts() {
    return Object.values(portfolioOverview!.accounts).filter(
      (overviewAccount) =>
        getAccountType(overviewAccount) === rekeyType.replace("rekey-", "") &&
        overviewAccount.address !== account.address &&
        !overviewAccount.rekeyed_to
    );
  }

  function handleOpenSelectAccountModal() {
    setDisplayInfoModal(false);
  }

  function resetSelectedAddress() {
    setSelectedAccountAddress("");
  }

  function handleOnAccountSelect(selectedAddress: string) {
    setSelectedAccountAddress(selectedAddress);
  }

  async function handleRekeyingAccount() {
    if (!signer) return;

    if (Number(account.total_algo_value) <= signer.getSuggestedFee()) {
      simpleToaster.display({
        message: "Balance too low to cover rekey transaction fee",
        type: "error"
      });
      return;
    }

    try {
      setIsLoading(true);

      await signer
        .rekeyTxn({address: account.address, rekeyTo: rekeyedToAccount.address})
        .sign(account.rekeyed_to ?? account.address, {sendNetwork: true});

      simpleToaster.display({
        message: `Account rekeyed successfully.`,
        type: "success"
      });

      closeModal();
    } catch (error) {
      simpleToaster.display({
        message: `Couldn’t rekey the account. Please try again.`,
        type: "error"
      });
    } finally {
      setIsLoading(false);

      closeModal();
    }
  }

  function closeModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {id: ACCOUNT_REKEY_MODAL_ID}
    });
  }
}

export default AccountRekeyModal;
