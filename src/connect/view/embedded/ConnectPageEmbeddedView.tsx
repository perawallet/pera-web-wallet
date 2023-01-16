import "./_connect-page-embedded-view.scss";

import {useCallback, useEffect, useState} from "react";

import appTellerManager, {PeraTeller} from "../../../core/app/teller/appTellerManager";
import {useAppContext} from "../../../core/app/AppContext";
import useTellerListener from "../../../core/util/hook/useTellerListener";
import PasswordAccessPage from "../../../password/page/access/PasswordAccessPage";
import ConnectPageSelectAccount from "../../select-account/ConnectPageSelectAccount";
import {useConnectFlowContext} from "../../context/ConnectFlowContext";
import {NETWORK_MISMATCH_MESSAGE} from "../../../core/util/algod/algodConstants";
import ConnectPageEmbeddedViewAddImportAccount from "./add-import-account/ConnectPageEmbeddedViewAddImportAccount";
import {appDBManager} from "../../../core/app/db";

export type ConnectPageEmbeddedViewPasswordCreateViews = "default" | "spinner";

function ConnectPageEmbeddedView() {
  const {
    state: {masterkey, hashedMasterkey, preferredNetwork, hasAccounts},
    dispatch: dispatchAppState
  } = useAppContext();
  const {
    formitoState: {selectedAccounts, currentSession},
    dispatchFormitoAction
  } = useConnectFlowContext();
  const [connectFlowEmbeddedView, setConnectFlowEmbeddedView] =
    useState<ConnectPageEmbeddedViewPasswordCreateViews>("default");

  useEffect(() => {
    if (masterkey) {
      appTellerManager.sendMessage({
        message: {
          type: "SELECT_ACCOUNT_EMBEDDED"
        },

        targetWindow: window.parent
      });
    }
  }, [masterkey]);

  // Receive "CONNECT" request from dApp
  const onReceiveMessage = useCallback(
    (event: MessageEvent<TellerMessage<PeraTeller>>) => {
      if (event.data.message.type === "CONNECT") {
        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {
            currentSession: event.data.message.data
          }
        });
      } else if (event.data.message.type === "SELECT_ACCOUNT_EMBEDDED_CALLBACK") {
        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {
            hasMessageReceived: true
          }
        });
      }
    },
    [dispatchFormitoAction]
  );

  useTellerListener(onReceiveMessage);

  return (
    <div className={"align-center--horizontally connect-page-embedded-view"}>
      <div className={"connect-page-embedded-view__box"}>{renderContent()}</div>
    </div>
  );

  function renderContent() {
    if (!hashedMasterkey || !hasAccounts) {
      return (
        <ConnectPageEmbeddedViewAddImportAccount
          view={connectFlowEmbeddedView}
          handleChangeView={handleChangeView}
        />
      );
    }
    if (!masterkey) {
      return <PasswordAccessPage type={"embedded"} ctaText={"Connect"} />;
    }

    return (
      <ConnectPageSelectAccount
        handleConnectClick={handleConnectClick}
        sendNetworkMismacthError={sendNetworkMismatchError}
      />
    );
  }

  async function handleConnectClick() {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        isConnectStarted: true
      }
    });

    if (selectedAccounts) {
      const selectedAddresses = selectedAccounts?.map((account) => account.address);
      const session = {
        ...currentSession!,
        accountAddresses: selectedAddresses || [],
        date: new Date(),
        network: preferredNetwork
      } as AppDBSession;

      await appDBManager.set("sessions", masterkey!)(currentSession!.url, session);

      dispatchAppState({type: "SET_SESSION", session});

      appTellerManager.sendMessage({
        message: {
          type: "CONNECT_CALLBACK",
          data: {
            addresses: selectedAddresses || []
          }
        },

        targetWindow: window.parent
      });
    }
  }

  function handleChangeView() {
    if (connectFlowEmbeddedView === "default") {
      appTellerManager.sendMessage({
        message: {
          type: "CREATE_PASSCODE_EMBEDDED"
        },

        targetWindow: window.parent
      });
      setConnectFlowEmbeddedView("spinner");
    }
  }

  function sendNetworkMismatchError() {
    appTellerManager.sendMessage({
      message: {
        type: "CONNECT_NETWORK_MISMATCH",
        error: NETWORK_MISMATCH_MESSAGE
      },

      targetWindow: window.parent
    });
  }
}

export default ConnectPageEmbeddedView;
