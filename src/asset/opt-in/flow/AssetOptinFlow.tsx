import {Route, Routes} from "react-router-dom";

import ROUTES from "../../../core/route/routes";
import AssetOptinPage from "../page/AssetOptinPage";
import AssetOptinSelectAccount from "../page/select-account/AssetOptinSelectAccount";
import Page from "../../../component/page/Page";
import {withGoBackLink} from "../../../core/route/context/NavigationContext";

function AssetOptinFlow() {
  return (
    <Routes>
      <Route element={<Page title={"Opt-in"} />}>
        <Route path={"/"} element={<AssetOptinPage />} />

        <Route
          path={ROUTES.ASSET_OPTIN.ACCOUNTS.ROUTE}
          element={<AssetOptinSelectAccount />}
        />
      </Route>
    </Routes>
  );
}

export default withGoBackLink(AssetOptinFlow, ROUTES.OVERVIEW.ROUTE);
