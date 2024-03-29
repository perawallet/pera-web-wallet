import "./_connect-page-tab-view.scss";

import {useCallback, useEffect, useState} from "react";
import classNames from "classnames";

import {useAppContext} from "../../../core/app/AppContext";
import appTellerManager, {PeraTeller} from "../../../core/app/teller/appTellerManager";
import useTellerListener from "../../../core/util/hook/useTellerListener";
import ConnectPageSelectAccount from "../../select-account/ConnectPageSelectAccount";
import {useConnectFlowContext} from "../../context/ConnectFlowContext";
import {NETWORK_MISMATCH_MESSAGE} from "../../../core/util/algod/algodConstants";
import ConnectPageTabViewAddImportAccount from "./add-import-account/ConnectPageTabViewAddImportAccount";
import PasswordAccessPage from "../../../password/page/access/PasswordAccessPage";
import PeraConnectErrorScreen from "../../../pera-connect-error/PeraConnectErrorScreen";
import {PERA_CONNECT_SHOW_ERROR_SCREEN_TIMEOUT} from "../../../pera-connect-error/util/peraConnectErrorScreenConstants";

function ConnectPageTabView() {
  const {
    state: {hashedMasterkey, hasAccounts}
  } = useAppContext();
  const {
    formitoState: {connectFlowView, hasMessageReceived, currentSession},
    dispatchFormitoAction
  } = useConnectFlowContext();
  const [shouldShowErrorScreen, setShouldShowErrorScreen] = useState(false);

  useEffect(() => {
    const messageReceivedTimeout = setTimeout(() => {
      setShouldShowErrorScreen(true);
    }, PERA_CONNECT_SHOW_ERROR_SCREEN_TIMEOUT);

    return () => clearTimeout(messageReceivedTimeout);
  }, []);

  // Receive "CONNECT" request from dApp
  const onReceiveMessage = useCallback(
    (event: MessageEvent<TellerMessage<PeraTeller>>) => {
      if (event.data.message.type === "TAB_OPEN") {
        appTellerManager.sendMessage({
          message: {
            type: "TAB_OPEN_RECEIVED"
          },

          targetWindow: window.opener
        });
      }

      if (event.data.message.type === "CONNECT") {
        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {
            hasMessageReceived: true,
            currentSession: event.data.message.data
          }
        });
      }
    },
    [dispatchFormitoAction]
  );

  useTellerListener(onReceiveMessage);

  return (
    <div
      className={classNames("connect-page-tab-view", {
        "connect-page-tab-view--add-import-account":
          connectFlowView === "add-account" && hashedMasterkey
      })}>
      <div className={"connect-page-tab-view__content"}>{renderContent()}</div>
    </div>
  );

  function renderContent() {
    if (shouldShowErrorScreen && !hasMessageReceived && !currentSession) {
      return <PeraConnectErrorScreen />;
    }

    if (connectFlowView === "add-account") {
      return <ConnectPageTabViewAddImportAccount />;
    }

    if (connectFlowView === "select-account") {
      return (
        <ConnectPageSelectAccount sendNetworkMismacthError={sendNetworkMismatchError} />
      );
    }

    return <PasswordAccessPage type={"connect-new-tab"} onSubmit={handleChangeView} />;
  }

  function handleChangeView() {
    if (connectFlowView === "password-access") {
      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {
          connectFlowView: hasAccounts ? "select-account" : "add-account"
        }
      });
    }
  }

  function sendNetworkMismatchError() {
    setTimeout(() => {
      appTellerManager.sendMessage({
        message: {
          type: "CONNECT_NETWORK_MISMATCH",
          error: NETWORK_MISMATCH_MESSAGE
        },

        targetWindow: window.opener
      });

      // eslint-disable-next-line no-magic-numbers
    }, 3000);
  }
}

export default ConnectPageTabView;
