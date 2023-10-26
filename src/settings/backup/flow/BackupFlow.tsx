import {Routes, Route} from "react-router-dom";

import ROUTES from "../../../core/route/routes";
import CardLayout from "../../../layouts/card-layout/CardLayout";
import BackupFile from "../page/backup-file/BackupFile";
import BackupPassphrase from "../page/backup-passphrase/BackupPassphrase";
import BackupSelectAccounts from "../page/select-accounts/BackupSelectAccounts";

function BackupFlow() {
  return (
    <Routes>
      <Route element={<CardLayout />}>
        <Route index={true} element={<BackupSelectAccounts />} />

        <Route
          path={`${ROUTES.SETTINGS.BACKUP.PASSPHRASE.ROUTE}/*`}
          element={<BackupPassphrase />}
        />

        <Route path={`${ROUTES.SETTINGS.BACKUP.FILE.ROUTE}/*`} element={<BackupFile />} />
      </Route>
    </Routes>
  );
}

export default BackupFlow;
