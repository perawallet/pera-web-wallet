import "./_connect-page-tab-view-add-import-account.scss";

import {useAppContext} from "../../../../core/app/AppContext";
import PasswordCreatePage from "../../../../password/page/create/PasswordCreatePage";
import ConnectPageAccountCreate from "./account-create/ConnectPageAccountCreate";
import ConnectPageImportAccount from "./import-account/ConnectPageImportAccount";
import {useConnectFlowContext} from "../../../context/ConnectFlowContext";
import ConnectPageImportAccountFromMobile from "./import-account-from-mobile/ConnectPageImportAccountFromMobile";
import AccountImportLedgerPage from "../../../../account/page/import/ledger/AccountImportLedger";
import ConnectPageOnboardingOptionList from "./onboarding-option-list/ConnectPageOnboardingOptionList";
import ConnectPageTabViewImportOptionList from "./onboarding-option-list/import/ConnectPageTabViewImportOptionList";

const CONNECT_PAGE_TAB_VIEW_PAGES = {
  create: <ConnectPageAccountCreate />,
  recovery: <ConnectPageImportAccount />,
  import: <ConnectPageImportAccountFromMobile />,
  importOptions: <ConnectPageTabViewImportOptionList />,
  nano: <AccountImportLedgerPage />,
  default: <ConnectPageOnboardingOptionList />
};

function ConnectPageTabViewAddImportAccount() {
  const {
    state: {hashedMasterkey}
  } = useAppContext();
  const {
    formitoState: {connectFlowAddImportAccountView}
  } = useConnectFlowContext();

  if (!hashedMasterkey) {
    return <PasswordCreatePage type={"connect"} />;
  }

  return CONNECT_PAGE_TAB_VIEW_PAGES[connectFlowAddImportAccountView ?? "default"];
}

export default ConnectPageTabViewAddImportAccount;
