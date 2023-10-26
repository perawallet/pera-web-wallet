import AccountCreationAnimation from "../../../../../account/component/account-creation-animation/AccountCreationAnimation";
import AccountCreate from "../../../../../account/page/create/AccountCreate";
import AccountSuccessPage from "../../../../../account/page/success/AccountSuccessPage";
import CardLayoutWithoutRoute from "../../../../../layouts/card-layout-without-route/CardLayoutWithoutRoute";
import {
  ConnectFlowAccountCreateViews,
  useConnectFlowContext
} from "../../../../context/ConnectFlowContext";
import AccountPassphraseModal from "../../../../../account/component/account-passphrase-modal/AccountPassphraseModal";

const ConnectPageAccountCreateViews: Record<ConnectFlowAccountCreateViews, JSX.Element> =
  {
    create: <AccountCreate flow={"connect"} />,
    backup: <AccountPassphraseModal flow={"connect"} />,
    animation: <AccountCreationAnimation type={"CREATE"} flow={"connect"} />,
    success: <AccountSuccessPage type={"CREATE"} flow={"connect"} />
  };

function ConnectPageAccountCreate() {
  const {
    formitoState: {createAccountViews}
  } = useConnectFlowContext();

  if (createAccountViews === "success") {
    return ConnectPageAccountCreateViews[createAccountViews];
  }

  return (
    <CardLayoutWithoutRoute>
      {ConnectPageAccountCreateViews[createAccountViews]}
    </CardLayoutWithoutRoute>
  );
}

export default ConnectPageAccountCreate;
