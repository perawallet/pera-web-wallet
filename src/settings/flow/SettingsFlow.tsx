import {Route, Routes} from "react-router-dom";

import ROUTES from "../../core/route/routes";
import PeraConnectSessions from "../page/pera-connect-sessions/PeraConnectSessions";
import Settings from "../page/settings/Settings";

function SettingsFlow() {
  return (
    <Routes>
      <Route path={"/"} element={<Settings />} />

      <Route path={ROUTES.SETTINGS.SESSIONS.ROUTE} element={<PeraConnectSessions />} />
    </Routes>
  );
}

export default SettingsFlow;
