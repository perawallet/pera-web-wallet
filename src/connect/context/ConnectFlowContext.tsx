import algosdk from "algosdk";
import {createContext, useCallback, useContext, useEffect} from "react";
import {useSearchParams} from "react-router-dom";

import {AccountCreateContextProvider} from "../../account/flow/create/AccountCreateFlow";
import {useAppContext} from "../../core/app/AppContext";
import {appDBManager} from "../../core/app/db";
import appTellerManager from "../../core/app/teller/appTellerManager";
import {NO_OP} from "../../core/util/array/arrayUtils";
import useFormito from "../../core/util/hook/formito/useFormito";
import useDBAccounts from "../../core/util/hook/useDBAccounts";

export type ConnectFlowViews = "add-account" | "select-account" | "password-access";
export type ConnectFlowAddImportAccountView =
  | "default"
  | "importOptions"
  | "create"
  | "recovery"
  | "import"
  | "nano";
export type ConnectFlowAccountCreateViews = "create" | "backup" | "animation" | "success";
export type ConnectFlowImportAccountViews =
  | "prepare"
  | "recovery"
  | "name"
  | "animation"
  | "success";
export type ConnectFlowImportAccountFromMobileViews = "prepare" | "qr" | "success";

export type ConnectFlowState = {
  dbAccounts: AppDBScheme["accounts"] | null;
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
  importedAccountsFromMobile: AppDBAccount[];
  handleConnectClick: (selectedAccounts: AppDBAccount[]) => Promise<void>;
};

export const initialConnectFlowState = {
  dbAccounts: null as AppDBScheme["accounts"] | null,
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
    state: {hashedMasterkey, masterkey, hasAccounts, preferredNetwork},
    dispatch: dispatchAppState
  } = useAppContext();
  const {formitoState, dispatchFormitoAction} = useFormito<ConnectFlowState>({
    ...initialConnectFlowState,
    connectFlowView: hashedMasterkey ? "password-access" : "add-account",
    handleConnectClick: NO_OP as unknown as ConnectFlowState["handleConnectClick"]
  });
  const dbAccounts = useDBAccounts();
  const [searchParams] = useSearchParams();
  const isEmbedded = Boolean(searchParams.get("embedded"));

  const handleConnectClick = useCallback(
    async (selectedAccounts: AppDBAccount[]) => {
      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {isConnectStarted: true}
      });

      if (selectedAccounts) {
        const selectedAddresses = selectedAccounts?.map((account) => account.address);
        const session = {
          ...formitoState.currentSession!,
          accountAddresses: selectedAddresses || [],
          date: new Date(),
          network: preferredNetwork
        } as AppDBSession;

        await appDBManager.set("sessions", masterkey!)(
          formitoState.currentSession!.url,
          session
        );

        dispatchAppState({type: "SET_SESSION", session});

        appTellerManager.sendMessage({
          message: {
            type: "CONNECT_CALLBACK",
            data: {addresses: selectedAddresses || []}
          },

          targetWindow: isEmbedded ? window.parent : window.opener
        });
      }
    },
    [
      dispatchAppState,
      dispatchFormitoAction,
      formitoState.currentSession,
      isEmbedded,
      masterkey,
      preferredNetwork
    ]
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

  useEffect(() => {
    if (dbAccounts) {
      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {dbAccounts}
      });
    }
  }, [dbAccounts, dispatchFormitoAction]);

  return (
    <AccountCreateContextProvider>
      <ConnectFlowContext.Provider
        value={{
          formitoState: {...formitoState, handleConnectClick},
          dispatchFormitoAction
        }}>
        {children}
      </ConnectFlowContext.Provider>
    </AccountCreateContextProvider>
  );
}

function useConnectFlowContext() {
  return useContext(ConnectFlowContext);
}

export default ConnectFlowContextProvider;
export {useConnectFlowContext};
