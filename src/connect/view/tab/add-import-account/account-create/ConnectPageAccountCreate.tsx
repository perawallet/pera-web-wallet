import AccountCreationAnimation from "../../../../../account/component/account-creation-animation/AccountCreationAnimation";
import AccountCreate from "../../../../../account/page/create/AccountCreate";
import AccountSuccessPage from "../../../../../account/page/success/AccountSuccessPage";
import CardLayoutWithoutRoute from "../../../../../layouts/card-layout-without-route/CardLayoutWithoutRoute";
import {useConnectFlowContext} from "../../../../context/ConnectFlowContext";

export type ConnectPageAccountCreateViews = "create" | "animation" | "success";

function ConnectPageAccountCreate() {
  const {
    formitoState: {createAccountViews}
  } = useConnectFlowContext();

  if (createAccountViews === "success") {
    return <AccountSuccessPage type={"CREATE"} flow={"connect"} />;
  }

  return (
    <CardLayoutWithoutRoute>
      {createAccountViews === "animation" ? (
        <AccountCreationAnimation type={"CREATE"} flow={"connect"} />
      ) : (
        <AccountCreate flow={"connect"} />
      )}
    </CardLayoutWithoutRoute>
  );
}

export default ConnectPageAccountCreate;
