import {Routes, Route, Navigate} from "react-router-dom";

import Page from "../../component/page/Page";
import ROUTES from "../../core/route/routes";
import CardLayout from "../../layouts/card-layout/CardLayout";
import PasswordAccessPage from "../page/access/PasswordAccessPage";
import PasswordCreatePage from "../page/create/PasswordCreatePage";

function PasswordFlow() {
  return (
    <Routes>
      <Route element={<Page title={"Passcode"} />}>
        <Route element={<CardLayout />}>
          <Route index={true} element={<PasswordAccessPage />} />

          <Route
            path={`${ROUTES.PASSWORD.CREATE.ROUTE}`}
            element={<PasswordCreatePage />}
          />
        </Route>
      </Route>

      <Route path={"*"} element={<Navigate to={ROUTES.PASSWORD.ROUTE} />} />
    </Routes>
  );
}

export default PasswordFlow;
