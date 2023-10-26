import "./_connect-page-embedded-view.scss";

import {useCallback, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

import appTellerManager, {PeraTeller} from "../../../core/app/teller/appTellerManager";
import {useAppContext} from "../../../core/app/AppContext";
import useTellerListener from "../../../core/util/hook/useTellerListener";
import PasswordAccessPage from "../../../password/page/access/PasswordAccessPage";
import ConnectPageSelectAccount from "../../select-account/ConnectPageSelectAccount";
import {useConnectFlowContext} from "../../context/ConnectFlowContext";
import {NETWORK_MISMATCH_MESSAGE} from "../../../core/util/algod/algodConstants";
import ConnectPageEmbeddedViewAddImportAccount from "./add-import-account/ConnectPageEmbeddedViewAddImportAccount";
import PeraConnectErrorScreen from "../../../pera-connect-error/PeraConnectErrorScreen";
import {PERA_CONNECT_SHOW_ERROR_SCREEN_TIMEOUT} from "../../../pera-connect-error/util/peraConnectErrorScreenConstants";

export type ConnectPageEmbeddedViewPasswordCreateViews = "default" | "spinner";

function ConnectPageEmbeddedView() {
  const {
    state: {masterkey, hashedMasterkey, hasAccounts}
  } = useAppContext();
  const {
    formitoState: {hasMessageReceived, currentSession},
    dispatchFormitoAction
  } = useConnectFlowContext();
  const [searchParams] = useSearchParams();
  const isCompactMode = searchParams.get("compactMode") === "true";
  const [connectFlowEmbeddedView, setConnectFlowEmbeddedView] =
    useState<ConnectPageEmbeddedViewPasswordCreateViews>("default");
  const [shouldShowErrorScreen, setShouldShowErrorScreen] = useState(false);

  useEffect(() => {
    const messageReceivedTimeout = setTimeout(() => {
      setShouldShowErrorScreen(true);
    }, PERA_CONNECT_SHOW_ERROR_SCREEN_TIMEOUT);

    return () => clearTimeout(messageReceivedTimeout);
  }, []);

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
      if (event.data.message.type === "IFRAME_INITIALIZED") {
        appTellerManager.sendMessage({
          message: {
            type: "IFRAME_INITIALIZED_RECEIVED"
          },

          targetWindow: window.parent
        });
      }

      let payload:
        | {currentSession: AppSession}
        | {hasMessageReceived: boolean}
        | undefined;

      if (event.data.message.type === "CONNECT") {
        payload = {currentSession: event.data.message.data};
      }

      if (event.data.message.type === "SELECT_ACCOUNT_EMBEDDED_CALLBACK") {
        payload = {hasMessageReceived: true};
      }

      if (payload) {
        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload
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

    if (shouldShowErrorScreen && !hasMessageReceived && !currentSession && masterkey) {
      return <PeraConnectErrorScreen type={"embedded"} />;
    }

    if (!masterkey) {
      return (
        <PasswordAccessPage
          type={"embedded"}
          ctaText={"Connect"}
          isCompactMode={isCompactMode}
        />
      );
    }

    return (
      <ConnectPageSelectAccount
        sendNetworkMismacthError={sendNetworkMismatchError}
        type={"embedded"}
      />
    );
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
