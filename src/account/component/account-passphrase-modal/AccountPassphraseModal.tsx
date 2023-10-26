import "./_account-passphrase-modal.scss";

import algosdk from "algosdk";

import AccountPassphraseBox from "../account-passphrase-box/AccountPassphraseBox";
import ROUTES from "../../../core/route/routes";
import Button from "../../../component/button/Button";
import {useAccountCreateContext} from "../../flow/create/AccountCreateFlow";
import useNavigateFlow from "../../../core/route/navigate/useNavigateFlow";
import {AccountComponentFlows} from "../../util/accountTypes";
import {useConnectFlowContext} from "../../../connect/context/ConnectFlowContext";

function AccountPassphraseModal({flow = "default"}: {flow?: AccountComponentFlows}) {
  const {account} = useAccountCreateContext();
  const {dispatchFormitoAction} = useConnectFlowContext();
  const navigateFlow = useNavigateFlow();
  const passphrase = algosdk.secretKeyToMnemonic(account.sk);

  return (
    <div className={"account-passphrase-modal"}>
      <h2 className={"typography--h2 text-color--main account-passphrase-modal__title"}>
        {"Back up your passphrase"}
      </h2>

      <div className={"account-passphrase-modal__description"}>
        <span className={"text-color--gray"}>
          {
            "Your 25-word passphrase is the key to this account. Without it, you cannot recover the account or its funds and assets."
          }
        </span>

        <span className={"text-color--gray"}>
          {
            "Please ensure you have stored the passphrase securely before proceeding, or you risk losing access to this account in future."
          }
        </span>
      </div>

      <AccountPassphraseBox passphrase={passphrase} displayCopyToClipboard={true} />

      <Button
        size={"large"}
        onClick={handleConfirm}
        customClassName={"button--fluid account-passphrase-modal__cta"}>
        {"I have backed it up"}
      </Button>
    </div>
  );

  function handleConfirm() {
    if (flow === "default") navigateFlow(ROUTES.ACCOUNT.CREATE.PENDING.FULL_PATH);
    else {
      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {createAccountViews: "animation"}
      });
    }
  }
}

export default AccountPassphraseModal;
