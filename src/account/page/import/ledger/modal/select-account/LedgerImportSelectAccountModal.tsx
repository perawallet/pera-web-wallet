import "./_ledger-import-select-account-modal.scss";

import {ReactComponent as ArrowLeftIcon} from "../../../../../../core/ui/icons/arrow-left.svg";

import {useCallback} from "react";
import Transport from "@ledgerhq/hw-transport";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import {Spinner, useToaster} from "@hipo/react-ui-toolkit";

import Button from "../../../../../../component/button/Button";
import {generateLedgerToastErrorMessage} from "../../accountImportLedgerUtils";
import {useAppContext} from "../../../../../../core/app/AppContext";
import MultipleSelectableAccountList, {
  MultipleSelectableAccountListProps
} from "../../../../../component/list/selectable/MultipleSelectableAccountList";
import CheckboxInput from "../../../../../../component/checkbox/Checkbox";
import useFormito from "../../../../../../core/util/hook/formito/useFormito";
import {trimAccountAddress} from "../../../../../util/accountUtils";
import {appDBManager} from "../../../../../../core/app/db";
import {useModalDispatchContext} from "../../../../../../component/modal/context/ModalContext";
import PeraToast from "../../../../../../component/pera-toast/PeraToast";
import LedgerImportAccountsAddedModal, {
  LEDGER_IMPORT_ACCOUNTS_ADDED_MODAL_ID
} from "../added-accounts/LedgerImportAccountsAddedModal";
import webStorage, {
  STORED_KEYS
} from "../../../../../../core/util/storage/web/webStorage";
import useLedgerAccounts from "../../../../../../core/util/hook/useLedgerAccounts";
import {usePortfolioContext} from "../../../../../../overview/context/PortfolioOverviewContext";

export const ACCOUNT_IMPORT_LEDGER_GAP_LIMIT = 20;
export const ACCOUNT_IMPORT_LEDGER_SELECT_MODAL_ID = "select-account-list";
const BATCH_SIZE = 4;

const initialLedgerImportSelectAccountModalState: {
  loadMoreIndex: number;
  shouldDisplayLoadMore: boolean;
  shouldHideZeroBalancedAccounts: boolean;
} = {
  shouldDisplayLoadMore: true,
  loadMoreIndex: 0,
  shouldHideZeroBalancedAccounts: false
};

type LedgerImportSelectAccountModalProps = {
  connection: Transport;
  handleConnectClick?: (accounts: AppDBAccount[]) => Promise<void>;
};

function LedgerImportSelectAccountModal({
  connection,
  handleConnectClick
}: LedgerImportSelectAccountModalProps) {
  const {
    state: {masterkey, hasAccounts},
    dispatch: dispatchAppState
  } = useAppContext();
  const {accounts} = usePortfolioContext()!;
  const {
    formitoState: {loadMoreIndex, shouldDisplayLoadMore, shouldHideZeroBalancedAccounts},
    dispatchFormitoAction
  } = useFormito(initialLedgerImportSelectAccountModalState);

  const toaster = useToaster();
  const dispatchModalStateAction = useModalDispatchContext();

  const handleCloseModal = useCallback(() => {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {id: ACCOUNT_IMPORT_LEDGER_SELECT_MODAL_ID}
    });
  }, [dispatchModalStateAction]);

  const handleToastLedgerErrorMessage = useCallback((error: any) => {
    const toastMessage = generateLedgerToastErrorMessage(error);

    if (!toastMessage) return;

    toaster.hideAll();
    toaster.display({
      render() {
        return (
          <PeraToast
            type={"warning"}
            title={toastMessage.title}
            detail={toastMessage.detail}
          />
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: ledgerAccountsOverview,
    isRequestPending: shouldDisplaySpinner,
    error: ledgerAccountsOverviewError
  } = useLedgerAccounts(connection, {
    startIndex: loadMoreIndex,
    batchSize: BATCH_SIZE
  });

  if (ledgerAccountsOverviewError)
    handleToastLedgerErrorMessage(ledgerAccountsOverviewError);

  if (shouldDisplaySpinner && !ledgerAccountsOverview) {
    return (
      <div className={"account-import-ledger-select-modal__spinner-container"}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={"account-import-ledger-select-modal"}>
      <div className={"account-import-ledger-select-modal__heading"}>
        <Button buttonType={"ghost"} onClick={handleCloseModal}>
          <ArrowLeftIcon />
        </Button>

        {connection.deviceModel?.productName && (
          <h2 className={"typography--h2"}>{connection.deviceModel.productName}</h2>
        )}
      </div>

      <p
        className={
          "account-import-ledger-select-modal__subheading typography--body text-color--main"
        }>
        {"Select accounts to add to your Pera Wallet"}
      </p>

      {ledgerAccountsOverview && ledgerAccountsOverview.length > 0 && (
        <MultipleSelectableAccountList
          key={`account-import-ledger--${
            shouldHideZeroBalancedAccounts ? "zero-filtered" : "default"
          }`}
          accounts={getLedgerAccountOverview()}
          onFormSubmit={handleSelectAccountFormSubmit}
          toggleAllCheckboxContent={
            <CheckboxInput
              customClassName={"account-import-ledger-select-modal__list-checkbox-label"}
              isSelected={shouldHideZeroBalancedAccounts}
              onSelect={toggleZeroBalancedAccountsFilter}
              item={{
                id: "hide-all",
                content: (
                  <Button
                    customClassName={
                      "account-import-ledger-select-modal__hide-0-balanced"
                    }
                    buttonType={"ghost"}
                    onClick={toggleZeroBalancedAccountsFilter}>
                    {"Hide 0 balance accounts"}
                  </Button>
                ),
                inputProps: {htmlFor: "hide-all", name: "hide-all", value: ""}
              }}
            />
          }
          onLoadMoreClick={shouldDisplayLoadMore ? handleLoadMore : undefined}
          isInitiallyAllChecked={false}
          ctaText={"Add to Pera Wallet"}
          customClassName={"account-import-ledger-select-modal__form"}
          shouldDisplaySpinner={shouldDisplaySpinner}
          shouldDisplayAssetDetails={true}
        />
      )}
    </div>
  );

  function handleLoadMore() {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        loadMoreIndex: loadMoreIndex + BATCH_SIZE
      }
    });
  }

  function getLedgerAccountOverview() {
    const ledgerAccountDetails: MultipleSelectableAccountListProps["accounts"] =
      ledgerAccountsOverview!.map((accountOverview) => ({
        ...accountOverview,
        type: "ledger"
      }));

    if (!shouldHideZeroBalancedAccounts) return ledgerAccountDetails;

    return ledgerAccountDetails!.filter(
      (account) => Number(account.total_algo_value) !== 0
    );
  }

  async function handleSelectAccountFormSubmit(addresses: string[]) {
    const importedAccounts: AppDBAccount[] = [];

    for (const address of addresses) {
      const bip32 = Object.values(ledgerAccountsOverview!).find(
        (ledgerAccount) => ledgerAccount.address === address
      )?.bip32;

      const newAccount = {
        address,
        name: accounts[address]?.name || trimAccountAddress(address),
        date: new Date(),
        bip32,
        usbOnly: connection instanceof TransportWebHID
      };

      await appDBManager.set("accounts", masterkey!)(address, newAccount);

      importedAccounts.push(newAccount);
    }

    if (importedAccounts.length > 0 && !hasAccounts) {
      dispatchAppState({type: "SET_HAS_ACCOUNTS", hasAccounts: true});
    }

    webStorage.local.setItem(STORED_KEYS.IMPORTED_NEW_ACCOUNTS, true);

    handleCloseModal();

    if (handleConnectClick) {
      await handleConnectClick(importedAccounts);

      return;
    }

    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: LEDGER_IMPORT_ACCOUNTS_ADDED_MODAL_ID,
          modalContentLabel: "Ledger Imported Accounts Info Modal",
          children: (
            <LedgerImportAccountsAddedModal
              addresses={importedAccounts.map((account) => account.address)}
            />
          ),
          shouldCloseOnOverlayClick: false,
          shouldCloseOnEsc: false
        }
      }
    });
  }

  function toggleZeroBalancedAccountsFilter() {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        shouldDisplayLoadMore: shouldHideZeroBalancedAccounts,
        shouldHideZeroBalancedAccounts: !shouldHideZeroBalancedAccounts
      }
    });
  }
}

export default LedgerImportSelectAccountModal;
