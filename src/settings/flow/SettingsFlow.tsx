import {Route, Routes} from "react-router-dom";

import RequirePassword from "../../core/route/RequirePassword";
import ROUTES from "../../core/route/routes";
import BackupFlow from "../backup/flow/BackupFlow";
import PeraConnectSessions from "../page/pera-connect-sessions/PeraConnectSessions";
import Settings from "../page/settings/Settings";
import TransferMobileFlow from "../transfer-mobile/flow/TransferMobileFlow";

function SettingsFlow() {
  return (
    <Routes>
      <Route path={"/"} element={<Settings />} />

      <Route path={ROUTES.SETTINGS.SESSIONS.ROUTE} element={<PeraConnectSessions />} />

      <Route
        path={`${ROUTES.SETTINGS.TRANSFER_MOBILE.ROUTE}/*`}
        element={
          <RequirePassword>
            <TransferMobileFlow />
          </RequirePassword>
        }
      />

      <Route
        path={`${ROUTES.SETTINGS.BACKUP.ROUTE}/*`}
        element={
          <RequirePassword>
            <BackupFlow />
          </RequirePassword>
        }
      />
    </Routes>
  );
}

export default SettingsFlow;
