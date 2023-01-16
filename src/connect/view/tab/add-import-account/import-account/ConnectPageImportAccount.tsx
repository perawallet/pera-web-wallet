import AccountImportPassphrasePrepare from "../../../../../account/page/import/passphrase/prepare/AccountImportPassphrasePrepare";
import AccountCreationAnimation from "../../../../../account/component/account-creation-animation/AccountCreationAnimation";
import AccountImportPassphraseName from "../../../../../account/page/import/passphrase/name/AccountImportPassphraseName";
import AccountImportPassphraseRecovery from "../../../../../account/page/import/passphrase/recovery/AccountImportPassphraseRecovery";
import AccountSuccessPage from "../../../../../account/page/success/AccountSuccessPage";
import {useConnectFlowContext} from "../../../../context/ConnectFlowContext";
import CardLayoutWithoutRoute from "../../../../../layouts/card-layout-without-route/CardLayoutWithoutRoute";

function ConnectPageImportAccount() {
  const {
    formitoState: {importAccountViews}
  } = useConnectFlowContext();

  return importAccountViews === "success" ? (
    <AccountSuccessPage type={"IMPORT"} flow={"connect"} />
  ) : (
    <CardLayoutWithoutRoute>{renderContent()}</CardLayoutWithoutRoute>
  );

  function renderContent() {
    let content = <></>;

    switch (importAccountViews) {
      case "prepare":
        content = <AccountImportPassphrasePrepare flow={"connect"} />;
        break;
      case "recovery":
        content = <AccountImportPassphraseRecovery flow={"connect"} />;
        break;
      case "name":
        content = <AccountImportPassphraseName flow={"connect"} />;
        break;
      case "animation":
        content = (
          <AccountCreationAnimation
            type={"IMPORT"}
            flow={"connect"}
            successMessage={"Account imported!"}
          />
        );
        break;
      default:
        break;
    }

    return content;
  }
}

export default ConnectPageImportAccount;
