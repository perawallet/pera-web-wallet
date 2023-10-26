import "./_connect-page-onboarding-option-list.scss";

import AccountPageOnboardingOptionList from "../../../../../overview/page/welcome/account-page-onboarding-option-list/AccountPageOnboardingOptionList";
import {
  ConnectFlowAddImportAccountView,
  useConnectFlowContext
} from "../../../../context/ConnectFlowContext";

function ConnectPageOnboardingOptionList() {
  const {dispatchFormitoAction} = useConnectFlowContext();

  return (
    <div>
      <h1
        className={
          "typography--display text-color--main connect-page-onboarding-option-list__title"
        }>
        {"Add Account"}
      </h1>

      <AccountPageOnboardingOptionList onOptionClick={handleChangeView} />
    </div>
  );

  function handleChangeView(id: string) {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        connectFlowAddImportAccountView: id as ConnectFlowAddImportAccountView
      }
    });
  }
}

export default ConnectPageOnboardingOptionList;
