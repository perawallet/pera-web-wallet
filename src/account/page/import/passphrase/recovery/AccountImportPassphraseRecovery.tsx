import "./_account-import-passphrase-recovery.scss";

import algosdk from "algosdk";
import {useToaster} from "@hipo/react-ui-toolkit";

import ROUTES from "../../../../../core/route/routes";
import PeraToast from "../../../../../component/pera-toast/PeraToast";
import AccountMnemonicForm from "../../../../component/account-mnemonic-form/AccountMnemonicForm";
import useNavigateFlow from "../../../../../core/route/navigate/useNavigateFlow";
import {useConnectFlowContext} from "../../../../../connect/context/ConnectFlowContext";
import {AccountComponentFlows} from "../../../../util/accountTypes";

export interface AccountImportPassphraseRecoveryProps {
  flow?: AccountComponentFlows;
}

function AccountImportPassphraseRecovery({
  flow = "default"
}: AccountImportPassphraseRecoveryProps) {
  const navigate = useNavigateFlow();
  const toaster = useToaster();
  const {dispatchFormitoAction} = useConnectFlowContext();
  const isInConnectFlow = flow === "connect";

  return (
    <div className={"account-import-passphrase-recovery"}>
      <h2
        className={
          "typography--h2 text-color--main account-import-passphrase-recovery__title"
        }>
        {"Recovery Passphrase"}
      </h2>

      <p className={"typography--body text-color--gray"}>
        {"Enter your recovery passphrase in the correct order."}
      </p>

      <p
        className={
          "typography--medium-body text-color--main  account-import-passphrase-recovery__description"
        }>
        {"You can paste your passphrase as 25 words separated with commas or spaces."}
      </p>

      <AccountMnemonicForm onFormSubmit={handleImportAccountMnemonic} />
    </div>
  );

  function handleImportAccountMnemonic(mnemonicKeys: string[]) {
    const mnemonic = mnemonicKeys.join(" ");

    try {
      const account = algosdk.mnemonicToSecretKey(mnemonic);

      if (!isInConnectFlow) {
        navigate(ROUTES.ACCOUNT.IMPORT.PASSPHRASE.NAME.FULL_PATH, {
          state: {account}
        });

        return;
      }

      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {
          importedAccountInFlow: account,
          importAccountViews: "name"
        }
      });
    } catch (error: any) {
      console.error(error);

      toaster.display({
        render() {
          return (
            <PeraToast
              type={"warning"}
              title={"Wrong Passphrase"}
              detail={
                "Account not found. Please try again by entering the correct passphrase."
              }
              hasCloseButton={false}
            />
          );
        }
      });
    }
  }
}

export default AccountImportPassphraseRecovery;
