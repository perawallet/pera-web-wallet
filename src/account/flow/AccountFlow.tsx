import {Routes, Route, Navigate} from "react-router-dom";

import Page from "../../component/page/Page";
import {withGoBackLink} from "../../core/route/context/NavigationContext";
import ROUTES from "../../core/route/routes";
import AccountLandingPage from "../page/landing/AccountLandingPage";
import AccountCreateFlow from "./create/AccountCreateFlow";
import AccountImportFlow from "./import/AccountImportFlow";

function AccountFlow() {
  return (
    <Routes>
      <Route element={<Page title={"Add Account"} />}>
        <Route index={true} element={<AccountLandingPage />} />

        <Route
          path={`${ROUTES.ACCOUNT.CREATE.ROUTE}/*`}
          element={<AccountCreateFlow />}
        />

        <Route
          path={`${ROUTES.ACCOUNT.IMPORT.ROUTE}/*`}
          element={<AccountImportFlow />}
        />
      </Route>

      <Route path={"*"} element={<Navigate to={ROUTES.PASSWORD.ROUTE} />} />
    </Routes>
  );
}

export default withGoBackLink(AccountFlow);
