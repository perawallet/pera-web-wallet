import {Routes, Route} from "react-router-dom";

import ROUTES from "../../../core/route/routes";
import CardLayout from "../../../layouts/card-layout/CardLayout";
import AccountQRCodeSync from "../../../account/page/qr-code-sync/AccountQRCodeSync";
import TransferMobileSelectAccounts from "../page/select-accounts/TransferMobileSelectAccounts";

function TransferMobileFlow() {
  return (
    <Routes>
      <Route element={<CardLayout />}>
        <Route index={true} element={<TransferMobileSelectAccounts />} />

        <Route
          path={`${ROUTES.SETTINGS.TRANSFER_MOBILE.QR.ROUTE}`}
          element={<AccountQRCodeSync sync={"web-to-mobile"} />}
        />
      </Route>
    </Routes>
  );
}

export default TransferMobileFlow;
