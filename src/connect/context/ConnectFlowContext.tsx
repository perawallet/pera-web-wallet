import algosdk from "algosdk";
import {createContext, useContext, useEffect} from "react";

import {useAppContext} from "../../core/app/AppContext";
import useFormito from "../../core/util/hook/formito/useFormito";
import {PortfolioOverview} from "../../overview/util/hook/usePortfolioOverview";

export type ConnectFlowViews = "add-account" | "select-account" | "password-access";
export type ConnectFlowAddImportAccountView =
  | "default"
  | "create"
  | "recovery-passphrase"
  | "import-from-mobile";
export type ConnectFlowAccountCreateViews = "create" | "animation" | "success";
export type ConnectFlowImportAccountViews =
  | "prepare"
  | "recovery"
  | "name"
  | "animation"
  | "success";
export type ConnectFlowImportAccountFromMobileViews = "prepare" | "qr" | "success";

export type ConnectFlowState = {
  hasMessageReceived: boolean;
  isConnectStarted: boolean;
  currentSession: AppSession | null;
  selectedAccounts: AppDBAccount[] | null;
  connectFlowView: ConnectFlowViews;
  connectFlowAddImportAccountView: ConnectFlowAddImportAccountView;
  createAccountViews: ConnectFlowAccountCreateViews;
  importAccountViews: ConnectFlowImportAccountViews;
  importedAccountInFlow: algosdk.Account | null;
  importAccountFromMobileViews: ConnectFlowImportAccountFromMobileViews;
  accountBackup: {modificationKey?: string; backupId?: string} | null;
  importedAccountsFromMobile: PortfolioOverview["accounts"];
};

export const initialConnectFlowState = {
  hasMessageReceived: false,
  isConnectStarted: false,
  currentSession: null as AppSession | null,
  selectedAccounts: null as AppDBAccount[] | null,
  connectFlowView: "password-access" as ConnectFlowViews,
  connectFlowAddImportAccountView: "default" as ConnectFlowAddImportAccountView,
  createAccountViews: "create" as ConnectFlowAccountCreateViews,
  importAccountViews: "prepare" as ConnectFlowImportAccountViews,
  importedAccountInFlow: null as algosdk.Account | null,
  importAccountFromMobileViews: "prepare" as ConnectFlowImportAccountFromMobileViews,
  accountBackup: null as {modificationKey?: string; backupId?: string} | null,
  importedAccountsFromMobile: []
};

const ConnectFlowContext = createContext(
  {} as ReturnType<typeof useFormito<ConnectFlowState>>
);

function ConnectFlowContextProvider({children}: {children: React.ReactNode}) {
  const {
    state: {hashedMasterkey, masterkey, hasAccounts}
  } = useAppContext();
  const {formitoState, dispatchFormitoAction} = useFormito<ConnectFlowState>(
    getInitialConnectFlowState(hashedMasterkey)
  );

  useEffect(() => {
    if (!masterkey && hasAccounts) {
      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {
          connectFlowView: "password-access" as ConnectFlowViews
        }
      });
    }
  }, [dispatchFormitoAction, hasAccounts, masterkey]);

  return (
    <ConnectFlowContext.Provider value={{formitoState, dispatchFormitoAction}}>
      {children}
    </ConnectFlowContext.Provider>
  );
}

function useConnectFlowContext() {
  return useContext(ConnectFlowContext);
}

function getInitialConnectFlowState(
  hashedMasterkey: string | undefined
): ConnectFlowState {
  let connectFlowView: ConnectFlowViews = "password-access";

  if (!hashedMasterkey) connectFlowView = "add-account";

  return {
    ...initialConnectFlowState,
    connectFlowView
  };
}

export default ConnectFlowContextProvider;
export {useConnectFlowContext};
