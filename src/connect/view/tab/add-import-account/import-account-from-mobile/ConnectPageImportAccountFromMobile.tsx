import AccountImportPeraSyncPrepare from "../../../../../account/page/import/pera-sync/prepare/AccountImportPeraSyncPrepare";
import AccountQRCodeSync from "../../../../../account/page/qr-code-sync/AccountQRCodeSync";
import AccountImportPeraSyncSuccess from "../../../../../account/page/import/pera-sync/success/AccountImportPeraSyncSuccess";
import CardLayoutWithoutRoute from "../../../../../layouts/card-layout-without-route/CardLayoutWithoutRoute";
import {useConnectFlowContext} from "../../../../context/ConnectFlowContext";

function ConnectPageImportAccountFromMobile() {
  const {
    formitoState: {importAccountFromMobileViews}
  } = useConnectFlowContext();

  return <CardLayoutWithoutRoute>{renderContent()}</CardLayoutWithoutRoute>;

  function renderContent() {
    switch (importAccountFromMobileViews) {
      case "qr":
        return <AccountQRCodeSync sync={"mobile-to-web"} flow={"connect"} />;
      case "success":
        return <AccountImportPeraSyncSuccess flow={"connect"} />;
      default:
        return <AccountImportPeraSyncPrepare flow={"connect"} />;
    }
  }
}

export default ConnectPageImportAccountFromMobile;
