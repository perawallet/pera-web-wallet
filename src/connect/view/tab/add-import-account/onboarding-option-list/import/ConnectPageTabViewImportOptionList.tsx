import AccountImportOnboardingOptionList from "../../../../../../account/component/onboarding-option-list/AccountImportOnboardingOptionList";
import {
  ConnectFlowAddImportAccountView,
  useConnectFlowContext
} from "../../../../../context/ConnectFlowContext";

function ConnectPageTabViewImportOptionList() {
  const {dispatchFormitoAction} = useConnectFlowContext();

  return (
    <div>
      <h1 className={"typography--display text-color--main"}>{"Add Account"}</h1>

      <AccountImportOnboardingOptionList
        layout={"vertical"}
        onOptionClick={handleChangeView}
      />
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

export default ConnectPageTabViewImportOptionList;
