import {Outlet, Route, Routes} from "react-router-dom";

import ROUTES from "../../core/route/routes";
import CardLayout from "../../layouts/card-layout/CardLayout";
import SendTxnFlowContextProvider from "../context/SendTxnFlowContext";
import SendTxnConfirm from "../page/confirm-txn/SendTxnConfirm";
import SendTxnSelectAccount from "../page/select-txn-account/SendTxnSelectAccount";
import SendTxnSelectAsset from "../page/select-txn-asset/SendTxnSelectAsset";
import SendTxn from "../page/send-txn/SendTxn";
import SendTxnSuccess from "../page/success/SendTxnSuccess";

function SendTxnFlow() {
  return (
    <Routes>
      <Route
        element={
          <SendTxnFlowContextProvider>
            <Outlet />
          </SendTxnFlowContextProvider>
        }>
        <Route element={<CardLayout />}>
          <Route index={true} element={<SendTxn />} />

          <Route path={ROUTES.SEND_TXN.CONFIRM.ROUTE} element={<SendTxnConfirm />} />

          <Route path={ROUTES.SEND_TXN.SUCCESS.ROUTE} element={<SendTxnSuccess />} />
        </Route>

        <Route path={ROUTES.SEND_TXN.ASSETS.ROUTE} element={<SendTxnSelectAsset />} />

        <Route path={ROUTES.SEND_TXN.ACCOUNTS.ROUTE} element={<SendTxnSelectAccount />} />
      </Route>
    </Routes>
  );
}

export default SendTxnFlow;
