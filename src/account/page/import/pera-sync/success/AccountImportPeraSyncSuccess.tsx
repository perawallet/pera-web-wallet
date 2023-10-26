import "./_account-import-pera-sync-success.scss";

import {ReactComponent as CheckmarkIcon} from "../../../../../core/ui/icons/checkmark.svg";

import {useEffect} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {List, ListItem} from "@hipo/react-ui-toolkit";

import Button from "../../../../../component/button/Button";
import ROUTES from "../../../../../core/route/routes";
import AccountListItemContent from "../../../../component/account-list/account-list-item-content/AccountListItemContent";
import useLocationWithState from "../../../../../core/util/hook/useLocationWithState";
import {AccountComponentFlows} from "../../../../util/accountTypes";
import {useConnectFlowContext} from "../../../../../connect/context/ConnectFlowContext";
import {getPortfolioOverviewData} from "../../../../../overview/util/portfolioOverviewUtils";
import {useAppContext} from "../../../../../core/app/AppContext";
import useAsyncProcess from "../../../../../core/network/async-process/useAsyncProcess";
import useDBAccounts from "../../../../../core/util/hook/useDBAccounts";
import Skeleton from "../../../../../component/skeleton/Skeleton";

interface AccountImportPeraSuccessProps {
  flow?: AccountComponentFlows;
}

type LocationState = {
  importedAccounts: AppDBAccount[];
};

function AccountImportPeraSuccess({flow = "default"}: AccountImportPeraSuccessProps) {
  const navigate = useNavigate();
  const dbAccounts = useDBAccounts();
  const {formitoState, dispatchFormitoAction} = useConnectFlowContext();
  const {importedAccounts: importedAccountFromLocationState} =
    useLocationWithState<LocationState>();
  const isInConnectFlow = flow === "connect";
  const importedAccounts =
    isInConnectFlow && formitoState
      ? formitoState.importedAccountsFromMobile
      : importedAccountFromLocationState;
  const {
    state: {data: importedAccountsOverview},
    runAsyncProcess
  } = useAsyncProcess<PortfolioOverview>();
  const {
    state: {algoPrice}
  } = useAppContext();

  useEffect(() => {
    const abortController = new AbortController();

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

    if (!algoPrice || !dbAccounts) return;

    runAsyncProcess(
      getPortfolioOverviewData({
        algoPrice,
        addresses: importedAccounts.map((importedAccount) => importedAccount.address),
        abortSignal: abortController.signal,
        accounts: dbAccounts
      })
    );

    // eslint-disable-next-line consistent-return
    return () => abortController.abort();
  }, [
    importedAccounts,
    runAsyncProcess,
    dispatchFormitoAction,
    isInConnectFlow,
    algoPrice,
    dbAccounts
  ]);

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

      {!importedAccountsOverview && (
        <Skeleton
          // eslint-disable-next-line no-magic-numbers
          height={(importedAccounts?.length || 1) * 44}
          borderRadius={12}
          customClassName={"account-import-pera-success__skeleton"}
        />
      )}

      {importedAccountsOverview && (
        <div className={"account-import-pera-success__content"}>
          <List
            items={Object.values(importedAccountsOverview.accounts)}
            customClassName={"account-import-pera-success__account-list"}>
            {(account) => (
              <ListItem
                customClassName={"account-import-pera-success__account-list-item"}>
                <AccountListItemContent account={account} />
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
}

export default AccountImportPeraSuccess;
