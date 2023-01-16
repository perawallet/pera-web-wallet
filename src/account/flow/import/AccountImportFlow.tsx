import {Routes, Route, Navigate} from "react-router-dom";

import ROUTES from "../../../core/route/routes";
import CardLayout from "../../../layouts/card-layout/CardLayout";
import AccountImportPassphraseName from "../../page/import/passphrase/name/AccountImportPassphraseName";
import AccountImportPassphrasePrepare from "../../page/import/passphrase/prepare/AccountImportPassphrasePrepare";
import AccountImportPassphraseRecovery from "../../page/import/passphrase/recovery/AccountImportPassphraseRecovery";
import AccountImportPeraSyncPrepare from "../../page/import/pera-sync/prepare/AccountImportPeraSyncPrepare";
import AccountQRCodeSync from "../../page/qr-code-sync/AccountQRCodeSync";
import AccountImportPeraSyncSuccess from "../../page/import/pera-sync/success/AccountImportPeraSyncSuccess";
import AccountSuccessPage from "../../page/success/AccountSuccessPage";
import AccountCreationAnimation from "../../component/account-creation-animation/AccountCreationAnimation";
import NavigateFlow from "../../../core/route/navigate/NavigateFlow";

function AccountImportFlow() {
  return (
    <Routes>
      {/* via PASSPHRASE */}
      <Route path={`${ROUTES.ACCOUNT.IMPORT.PASSPHRASE.ROUTE}/*`}>
        <Route element={<CardLayout />}>
          <Route index={true} element={<AccountImportPassphrasePrepare />} />

          <Route
            path={`${ROUTES.ACCOUNT.IMPORT.PASSPHRASE.RECOVERY.ROUTE}`}
            element={<AccountImportPassphraseRecovery />}
          />

          <Route
            path={`${ROUTES.ACCOUNT.IMPORT.PASSPHRASE.NAME.ROUTE}`}
            element={
              <NavigateFlow>
                <AccountImportPassphraseName />
              </NavigateFlow>
            }
          />

          <Route
            path={`${ROUTES.ACCOUNT.IMPORT.PASSPHRASE.PENDING.ROUTE}`}
            element={
              <NavigateFlow>
                <AccountCreationAnimation
                  type={"IMPORT"}
                  successMessage={"Account imported!"}
                />
              </NavigateFlow>
            }
          />

          <Route path={"*"} element={<Navigate to={ROUTES.PASSWORD.ROUTE} />} />
        </Route>

        <Route
          path={`${ROUTES.ACCOUNT.IMPORT.PASSPHRASE.SUCCESS.ROUTE}`}
          element={
            <NavigateFlow>
              <AccountSuccessPage type={"IMPORT"} />
            </NavigateFlow>
          }
        />
      </Route>

      <Route path={`${ROUTES.ACCOUNT.IMPORT.PERA_SYNC.ROUTE}`}>
        <Route element={<CardLayout />}>
          <Route index={true} element={<AccountImportPeraSyncPrepare />} />

          <Route
            path={`${ROUTES.ACCOUNT.IMPORT.PERA_SYNC.QR.ROUTE}`}
            element={
              <NavigateFlow>
                <AccountQRCodeSync sync={"mobile-to-web"} />
              </NavigateFlow>
            }
          />

          <Route
            path={`${ROUTES.ACCOUNT.IMPORT.PERA_SYNC.SUCCESS.ROUTE}`}
            element={
              <NavigateFlow>
                <AccountImportPeraSyncSuccess />
              </NavigateFlow>
            }
          />
        </Route>
      </Route>

      <Route
        path={`${ROUTES.ACCOUNT.IMPORT.LEDGER.ROUTE}`}
        element={<div>{"to be implemented"}</div>}
      />

      <Route path={"*"} element={<Navigate to={ROUTES.PASSWORD.ROUTE} />} />
    </Routes>
  );
}

export default AccountImportFlow;
