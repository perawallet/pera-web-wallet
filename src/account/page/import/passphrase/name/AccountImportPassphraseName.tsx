import "./_account-import-passphrase-name.scss";

import {Account} from "algosdk";
import {useLocation} from "react-router-dom";

import {useAppContext} from "../../../../../core/app/AppContext";
import AccountNameForm from "../../../../component/account-name-form/AccountNameForm";
import ROUTES from "../../../../../core/route/routes";
import {encryptSK} from "../../../../../core/util/nacl/naclUtils";
import useNavigateFlow from "../../../../../core/route/navigate/useNavigateFlow";
import {useConnectFlowContext} from "../../../../../connect/context/ConnectFlowContext";
import {AccountComponentFlows} from "../../../../util/accountTypes";
import {appDBManager} from "../../../../../core/app/db";
import {useSimpleToaster} from "../../../../../component/simple-toast/util/simpleToastHooks";

type LocationState = {account: Account};

export interface AccountImportPassphraseNameProps {
  flow?: AccountComponentFlows;
}

function AccountImportPassphraseName({
  flow = "default"
}: AccountImportPassphraseNameProps) {
  const navigate = useNavigateFlow();
  const location = useLocation();
  const {formitoState, dispatchFormitoAction} = useConnectFlowContext();
  const {account} = (location?.state || {}) as LocationState;
  const isInConnectFlow = flow === "connect";
  const importedAccount =
    isInConnectFlow && formitoState ? formitoState.importedAccountInFlow : account;
  const {
    state: {masterkey, hasAccounts},
    dispatch: dispatchAppState
  } = useAppContext();
  const simpleToaster = useSimpleToaster();

  return (
    <div className={"account-import-passphrase-name"}>
      <h2
        className={
          "typography--h2 text-color--main account-import-passphrase-name__title"
        }>
        {"Name your account"}
      </h2>

      <AccountNameForm
        description={
          "Name your account to easily identify it while using the Pera Wallet. These names are stored locally, and can only be seen by you."
        }
        ctaText={"Complete Import"}
        onFormSubmit={handleAccountImportNaming}
      />
    </div>
  );

  async function handleAccountImportNaming(accountName: string) {
    if (!importedAccount || !masterkey) return;

    try {
      const pk = await encryptSK(importedAccount.sk, masterkey!);

      const newAccount = {
        name: accountName,
        address: importedAccount.addr,
        pk,
        date: new Date()
      };

      await appDBManager.set("accounts", masterkey)(importedAccount.addr, newAccount);

      if (!hasAccounts) {
        dispatchAppState({type: "SET_HAS_ACCOUNTS", hasAccounts: true});
      }

      if (!isInConnectFlow) {
        navigate(ROUTES.ACCOUNT.IMPORT.PASSPHRASE.PENDING.FULL_PATH);
        return;
      }

      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {
          importAccountViews: "animation"
        }
      });
    } catch {
      simpleToaster.display({
        message: `Account couldn't be imported.`,
        type: "error"
      });
    }
  }
}

export default AccountImportPassphraseName;
