import {Routes, Route} from "react-router-dom";

import ROUTES from "../../../../core/route/routes";
import CardLayout from "../../../../layouts/card-layout/CardLayout";
import AccountQRCodeSync from "../../qr-code-sync/AccountQRCodeSync";
import TransferMobile from "../page/prepare/TransferMobilePrepare";
import TransferMobileSelectAccounts from "../page/select-accounts/TransferMobileSelectAccounts";

function TransferMobileFlow() {
  return (
    <Routes>
      <Route element={<CardLayout />}>
        <Route index={true} element={<TransferMobile />} />

        <Route
          path={`${ROUTES.TRANSFER.SELECT_ACCOUNTS.ROUTE}`}
          element={<TransferMobileSelectAccounts />}
        />

        <Route
          path={`${ROUTES.TRANSFER.QR.ROUTE}`}
          element={<AccountQRCodeSync sync={"web-to-mobile"} />}
        />
      </Route>
    </Routes>
  );
}

export default TransferMobileFlow;
