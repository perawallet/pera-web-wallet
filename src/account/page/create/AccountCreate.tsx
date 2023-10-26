import "./_account-create.scss";

import ROUTES from "../../../core/route/routes";
import {useAppContext} from "../../../core/app/AppContext";
import AccountNameForm from "../../component/account-name-form/AccountNameForm";
import {encryptSK} from "../../../core/util/nacl/naclUtils";
import useNavigateFlow from "../../../core/route/navigate/useNavigateFlow";
import {AccountComponentFlows} from "../../util/accountTypes";
import {useConnectFlowContext} from "../../../connect/context/ConnectFlowContext";
import {appDBManager} from "../../../core/app/db";
import {useAccountCreateContext} from "../../flow/create/AccountCreateFlow";

interface AccountCreateProps {
  flow?: AccountComponentFlows;
}

function AccountCreate({flow = "default"}: AccountCreateProps) {
  const navigate = useNavigateFlow();
  const {
    state: {masterkey, hasAccounts},
    dispatch: dispatchAppState
  } = useAppContext();
  const {account} = useAccountCreateContext();
  const {dispatchFormitoAction} = useConnectFlowContext();

  return (
    <div className={"account-create"}>
      <h2 className={"typography--h2 text-color--main account-create__title"}>
        {"Name your account"}
      </h2>

      <AccountNameForm
        description={
          "Name your account to easily identify it while using the Pera Wallet. These names are stored locally, and can only be seen by you."
        }
        ctaText={"Create Account"}
        onFormSubmit={handleCreateAccountFormSubmit}
      />
    </div>
  );

  async function handleCreateAccountFormSubmit(accountName: string) {
    const pk = await encryptSK(account.sk, masterkey!);
    const newAccount = {
      type: "standard",
      address: account.addr,
      name: accountName,
      pk,
      date: new Date()
    } as AppDBAccount;

    await appDBManager.set("accounts", masterkey!)(account.addr, newAccount);

    if (!hasAccounts) {
      dispatchAppState({type: "SET_HAS_ACCOUNTS", hasAccounts: true});
    }

    if (flow === "connect") {
      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {createAccountViews: "backup"}
      });
    } else {
      navigate(ROUTES.ACCOUNT.CREATE.PASSPHRASE.ROUTE);
    }
  }
}

export default AccountCreate;
