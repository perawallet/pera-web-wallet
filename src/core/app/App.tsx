import {Suspense, useEffect} from "react";
import {Routes, Route, Navigate} from "react-router-dom";

import ROUTES from "../route/routes";
import RouteLoading from "../route/loading/RouteLoading";
import AccountFlow from "../../account/flow/AccountFlow";
import RequirePassword from "../route/RequirePassword";
import PasswordFlow from "../../password/flow/PasswordFlow";
import SidebarLayout from "../../layouts/sidebar/SidebarLayout";
import SettingsFlow from "../../settings/flow/SettingsFlow";
import OverviewFlow from "../../overview/flow/OverviewFlow";
import PasswordAccessPage from "../../password/page/access/PasswordAccessPage";
import CardLayout from "../../layouts/card-layout/CardLayout";
import ConnectFlow from "../../connect/flow/ConnectFlow";
import TransactionSignFlow from "../../transaction/flow/TransactionSignFlow";
import SendTxnFlow from "../../send-txn/flow/SendTxnFlow";
import WelcomePage from "../../overview/page/welcome/WelcomePage";
import AssetOptinFlow from "../../asset/opt-in/flow/AssetOptinFlow";
import TransactionSignFlowContextProvider from "../../transaction/context/TransactionSignFlowContext";
import ConnectFlowContextProvider from "../../connect/context/ConnectFlowContext";
import useRegisterDevice from "../util/hook/useRegisterDevice";
import useLockApp from "../util/hook/useLockApp";
import useKeyboardShortcut, {
  KEYBOARD_EVENT_KEY,
  COMBINATOR_KEYS
} from "../util/hook/useKeyboardShortcut";
import useCheckForInactivity from "../util/hook/useCheckForInactivity";

function App() {
  const lockApp = useLockApp();

  useCheckForInactivity();
  useRegisterDevice();
  useKeyboardShortcut([
    {
      key: KEYBOARD_EVENT_KEY.K,
      options: {combinatorKey: COMBINATOR_KEYS.META},
      callback: lockApp
    }
    // {key: KEYBOARD_EVENT_KEY.SLASH, callback: handleOpenSpotlight}
  ]);

  useEffect(() => {
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
    };

    function onUnload() {
      indexedDB.deleteDatabase("pera-wallet-assets");

      lockApp();
    }
  }, [lockApp]);

  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route element={<SidebarLayout />}>
          <Route path={ROUTES.BASE} element={<WelcomePage />} />

          <Route element={<CardLayout hasOverlay={true} />}>
            <Route
              path={`${ROUTES.ACCESS.ROUTE}`}
              element={
                <PasswordAccessPage
                  title={"Enter passcode"}
                  description={"Enter your passcode to proceed"}
                  ctaText={"Proceed"}
                  hasCancelButton={true}
                />
              }
            />
          </Route>

          <Route
            path={`${ROUTES.OVERVIEW.ROUTE}/*`}
            element={
              <RequirePassword>
                <OverviewFlow />
              </RequirePassword>
            }
          />

          <Route
            path={`${ROUTES.SETTINGS.ROUTE}/*`}
            element={
              <RequirePassword>
                <SettingsFlow />
              </RequirePassword>
            }
          />

          <Route
            path={`${ROUTES.SEND_TXN.ROUTE}/*`}
            element={
              <RequirePassword>
                <SendTxnFlow />
              </RequirePassword>
            }
          />

          <Route path={"*"} element={<Navigate to={ROUTES.PASSWORD.ROUTE} />} />
        </Route>

        <Route path={`${ROUTES.PASSWORD.ROUTE}/*`} element={<PasswordFlow />} />

        <Route
          path={`${ROUTES.ASSET_OPTIN.ROUTE}/*`}
          element={
            <RequirePassword>
              <AssetOptinFlow />
            </RequirePassword>
          }
        />

        <Route
          path={`${ROUTES.ACCOUNT.ROUTE}/*`}
          element={
            <RequirePassword>
              <AccountFlow />
            </RequirePassword>
          }
        />

        <Route
          path={`${ROUTES.CONNECT.ROUTE}/*`}
          element={
            <ConnectFlowContextProvider>
              <ConnectFlow />
            </ConnectFlowContextProvider>
          }
        />

        <Route
          path={`${ROUTES.TRANSACTION.SIGN.FULL_PATH}/*`}
          element={
            <TransactionSignFlowContextProvider>
              <TransactionSignFlow />
            </TransactionSignFlowContextProvider>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
