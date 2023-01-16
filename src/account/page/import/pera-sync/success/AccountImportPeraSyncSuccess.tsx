import "./_account-import-pera-sync-success.scss";

import {ReactComponent as CheckmarkIcon} from "../../../../../core/ui/icons/checkmark.svg";

import {useEffect} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {List, ListItem, Spinner} from "@hipo/react-ui-toolkit";

import Button from "../../../../../component/button/Button";
import ROUTES from "../../../../../core/route/routes";
import AccountListItemContent from "../../../../component/account-list/account-list-item-content/AccountListItemContent";
import {useAppContext} from "../../../../../core/app/AppContext";
import useLocationWithState from "../../../../../core/util/hook/useLocationWithState";
import useAsyncProcess from "../../../../../core/network/async-process/useAsyncProcess";
import {peraApi} from "../../../../../core/util/pera/api/peraApi";
import {PortfolioOverview} from "../../../../../overview/util/hook/usePortfolioOverview";
import {trimAccountAddress, trimAccountName} from "../../../../util/accountUtils";
import {AccountComponentFlows} from "../../../../util/accountTypes";
import {useConnectFlowContext} from "../../../../../connect/context/ConnectFlowContext";

interface AccountImportPeraSuccessProps {
  flow?: AccountComponentFlows;
}

type LocationState = {
  importedAccounts: PortfolioOverview["accounts"];
};

function AccountImportPeraSuccess({flow = "default"}: AccountImportPeraSuccessProps) {
  const navigate = useNavigate();
  const {
    state: {accounts}
  } = useAppContext();
  const {formitoState, dispatchFormitoAction} = useConnectFlowContext();
  const {importedAccounts: importedAccountFromLocationState} =
    useLocationWithState<LocationState>();
  const isInConnectFlow = flow === "connect";
  const importedAccounts =
    isInConnectFlow && formitoState
      ? formitoState.importedAccountsFromMobile
      : importedAccountFromLocationState;
  const {
    state: {data: importedAccountsOverview, isRequestPending, isRequestFetched},
    runAsyncProcess
  } = useAsyncProcess<PortfolioOverview>();

  useEffect(() => {
    if (!importedAccounts) {
      if (isInConnectFlow) {
        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {
            connectFlowView: "add-account"
          }
        });
      }

      return;
    }

    runAsyncProcess(
      peraApi.getMultipleAccountOverview({
        account_addresses: importedAccounts.map(
          (importedAccount) => importedAccount.address
        )
      })
    );
  }, [importedAccounts, runAsyncProcess, dispatchFormitoAction, isInConnectFlow]);

  if (!importedAccounts && !isInConnectFlow) {
    return <Navigate to={ROUTES.ACCOUNT.IMPORT.PERA_SYNC.ROUTE} />;
  }

  return (
    <div className={"account-import-pera-success align-center--vertically"}>
      <div className={"account-import-pera-success__icon align-center--horizontally"}>
        <CheckmarkIcon width={56} height={56} />
      </div>

      <div className={"account-import-pera-success__heading"}>
        <h1 className={"typography--h2"}>{"Accounts Imported!"}</h1>

        <p>
          <span>{importedAccounts?.length}</span>

          <span>{` account${
            importedAccounts && importedAccounts.length > 1 ? "s were" : " was"
          }  imported to Pera Web`}</span>
        </p>
      </div>

      {isRequestPending && (
        <div className={"account-import-pera-success__spinner"}>
          <Spinner />
        </div>
      )}

      {isRequestFetched && (
        <div className={"account-import-pera-success__content"}>
          <List
            items={getAccountOverviewList()}
            customClassName={"account-import-pera-success__account-list"}>
            {({address, total_algo_value}) => (
              <ListItem
                customClassName={"account-import-pera-success__account-list-item"}>
                <AccountListItemContent
                  name={getAccountName(address)}
                  address={address}
                  balance={total_algo_value}
                />
              </ListItem>
            )}
          </List>
        </div>
      )}

      <Button
        onClick={handleNavigation}
        customClassName={"account-import-pera-success__cta"}
        size={"large"}>
        {isInConnectFlow ? "Select Accounts" : "View Accounts"}
      </Button>
    </div>
  );

  function handleNavigation() {
    if (!isInConnectFlow) {
      navigate(ROUTES.OVERVIEW.ROUTE);

      return;
    }

    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        connectFlowView: "select-account"
      }
    });
  }

  function getAccountOverviewList() {
    const overview: Record<string, AccountOverview> = {};

    importedAccountsOverview?.accounts.forEach((account) => {
      overview[account.address] = account;
    });

    importedAccounts?.forEach((importedAccount) => {
      // newly created account on mobile
      // zero balanced not existed on network
      if (importedAccount.address in overview === false) {
        overview[importedAccount.address] = {
          ...importedAccount,
          standard_asset_count: 1,
          total_algo_value: "0"
        };
      }
    });

    return Object.values(overview);
  }

  function getAccountName(address: string): string {
    const accountName = accounts[address]?.name;

    // in case of accountName is an empty string
    return accountName ? trimAccountName(accountName) : trimAccountAddress(address);
  }
}

export default AccountImportPeraSuccess;
