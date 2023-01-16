import {Routes, Route, Navigate} from "react-router-dom";

import AccountCreate from "../../page/create/AccountCreate";
import ROUTES from "../../../core/route/routes";
import AccountSuccessPage from "../../page/success/AccountSuccessPage";
import CardLayout from "../../../layouts/card-layout/CardLayout";
import AccountCreationAnimation from "../../component/account-creation-animation/AccountCreationAnimation";
import NavigateFlow from "../../../core/route/navigate/NavigateFlow";
import {withGoBackLink} from "../../../core/route/context/NavigationContext";

function AccountCreateFlow() {
  return (
    <Routes>
      <Route element={<CardLayout />}>
        {/* Account Create Flow */}
        <Route index={true} element={<AccountCreate />} />

        <Route
          path={`${ROUTES.ACCOUNT.CREATE.PENDING.ROUTE}`}
          element={
            <NavigateFlow to={ROUTES.ACCOUNT.ROUTE}>
              <AccountCreationAnimation type={"CREATE"} />
            </NavigateFlow>
          }
        />

        <Route path={"*"} element={<Navigate to={ROUTES.PASSWORD.ROUTE} />} />
      </Route>

      <Route
        path={`${ROUTES.ACCOUNT.CREATE.SUCCESS.ROUTE}`}
        element={
          <NavigateFlow to={ROUTES.ACCOUNT.ROUTE}>
            <AccountSuccessPage type={"CREATE"} />
          </NavigateFlow>
        }
      />
    </Routes>
  );
}

export default withGoBackLink(AccountCreateFlow);
