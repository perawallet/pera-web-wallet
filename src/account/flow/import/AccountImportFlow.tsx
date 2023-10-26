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
import AccountImportLedger from "../../page/import/ledger/AccountImportLedger";
import AccountImportLandingPage from "../../page/import/AccountImportLandingPage";
import {withGoBackLink} from "../../../core/route/context/NavigationContext";
import AccountImportBackupPrepare from "../../page/import/backup/prepare/AccountImportBackupPrepare";
import AccountImportBackupFile from "../../page/import/backup/file/AccountImportBackupFile";
import AccountImportBackupPassphrase from "../../page/import/backup/passphrase/AccountImportBackupPassphrase";
import AccountImportBackupSelectAccounts from "../../page/import/backup/select-accounts/AccountImportBackupSelectAccounts";
import AccountImportBackupSuccess from "../../page/import/backup/success/AccountImportBackupSuccess";

function AccountImportFlow() {
  return (
    <Routes>
      <Route
        index={true}
        element={<AccountImportLandingPage title={"I already have an account"} />}
      />

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

      {/* via Pera Mobile */}
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

      <Route path={ROUTES.ACCOUNT.IMPORT.BACKUP.ROUTE}>
        <Route element={<CardLayout />}>
          <Route index={true} element={<AccountImportBackupPrepare />} />

          <Route
            path={ROUTES.ACCOUNT.IMPORT.BACKUP.FILE.ROUTE}
            element={<AccountImportBackupFile />}
          />

          <Route
            path={ROUTES.ACCOUNT.IMPORT.BACKUP.PASSPHRASE.ROUTE}
            element={<AccountImportBackupPassphrase />}
          />

          <Route
            path={ROUTES.ACCOUNT.IMPORT.BACKUP.ACCOUNTS.ROUTE}
            element={<AccountImportBackupSelectAccounts />}
          />
        </Route>

        <Route
          path={ROUTES.ACCOUNT.IMPORT.BACKUP.SUCCESS.ROUTE}
          element={<AccountImportBackupSuccess />}
        />
      </Route>

      <Route
        path={`${ROUTES.ACCOUNT.IMPORT.LEDGER.ROUTE}`}
        element={<AccountImportLedger />}
      />

      <Route path={"*"} element={<Navigate to={ROUTES.PASSWORD.ROUTE} />} />
    </Routes>
  );
}

export default withGoBackLink(AccountImportFlow);
