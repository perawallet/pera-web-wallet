import {ReactComponent as LedgerIcon} from "../../../../core/ui/icons/ledger.svg";

import "./_connect-page-tab-view-add-import-account.scss";

import ConnectPageOnboardingOptionList from "./onboarding-option-list/ConnectPageOnboardingOptionList";
import {useAppContext} from "../../../../core/app/AppContext";
import PasswordCreatePage from "../../../../password/page/create/PasswordCreatePage";
import ConnectPageAccountCreate from "./account-create/ConnectPageAccountCreate";
import ConnectPageImportAccount from "./import-account/ConnectPageImportAccount";
import {useConnectFlowContext} from "../../../context/ConnectFlowContext";
import ConnectPageImportAccountFromMobile from "./import-account-from-mobile/ConnectPageImportAccountFromMobile";

function ConnectPageTabViewAddImportAccount() {
  const {
    state: {hashedMasterkey}
  } = useAppContext();
  const {
    formitoState: {connectFlowAddImportAccountView}
  } = useConnectFlowContext();

  return renderContent();

  function renderContent() {
    if (!hashedMasterkey) {
      return <PasswordCreatePage type={"connect"} />;
    }

    switch (connectFlowAddImportAccountView) {
      case "create":
        return <ConnectPageAccountCreate />;

      case "recovery-passphrase":
        return <ConnectPageImportAccount />;

      case "import-from-mobile":
        return <ConnectPageImportAccountFromMobile />;

      default:
        return (
          <div>
            <h1 className={"typography--display text-color--main"}>{"Add Account"}</h1>

            <ConnectPageOnboardingOptionList
              shouldShowIllustrations={true}
              customClassName={"connect-page-tab-view-add-import-account__option-list"}
            />

            <div className={"connect-page-tab-view-add-import-account__nano-ledger"}>
              <LedgerIcon />

              <p className={"typography--subhead text-color--gray-light"}>
                {"Pair Nano Ledger"}
              </p>

              <div
                className={
                  "typography--tagline text-color--gray connect-page-tab-view-add-import-account__nano-ledger__badge"
                }>
                {"COMING SOON"}
              </div>
            </div>
          </div>
        );
    }
  }
}

export default ConnectPageTabViewAddImportAccount;
