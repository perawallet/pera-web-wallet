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
    state: {masterkey},
    dispatch: dispatchAppState
  } = useAppContext();

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

    const pk = await encryptSK(importedAccount.sk, masterkey!);

    const newAccount = {
      type: "standard" as AccountType,
      name: accountName,
      address: importedAccount.addr,
      pk,
      date: new Date()
    };

    await appDBManager.set("accounts", masterkey)(importedAccount.addr, newAccount);

    dispatchAppState({type: "SET_ACCOUNT", account: newAccount});

    if (!isInConnectFlow) {
      navigate(ROUTES.ACCOUNT.IMPORT.PASSPHRASE.PENDING.FULL_PATH, {
        state: {creationType: "import"}
      });
      return;
    }

    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        importAccountViews: "animation"
      }
    });
  }
}

export default AccountImportPassphraseName;
