import "./_account-import-passphrase-prepare.scss";

import {ReactComponent as KeyIcon} from "../../../../../core/ui/icons/key.svg";

import {Link} from "react-router-dom";

import ROUTES from "../../../../../core/route/routes";
import Button from "../../../../../component/button/Button";
import {AccountComponentFlows} from "../../../../util/accountTypes";
import {useConnectFlowContext} from "../../../../../connect/context/ConnectFlowContext";

export interface AccountImportPassphraseProps {
  flow?: AccountComponentFlows;
}

function AccountImportPassphrase({flow = "default"}: AccountImportPassphraseProps) {
  const {dispatchFormitoAction} = useConnectFlowContext();

  return (
    <div className={"account-import-passphrase"}>
      <div className={"account-import-passphrase__icon-wrapper"}>
        <KeyIcon width={56} height={56} />
      </div>

      <h1 className={"typography--h2 text-color--main"}>
        {"Import account with"}
        <br />
        {"Recovery Passphrase"}
      </h1>

      <p
        className={
          "typography--body text-color--gray account-import-passphrase__description"
        }>
        {
          "In the following steps, you'll enter your 25-word recovery passphrase to import an Algorand account. Have your recovery phrase handy before you begin."
        }
      </p>

      {flow === "connect" ? (
        <Button
          customClassName={"account-import-passphrase__cta"}
          onClick={handleChangeView}>
          {"Next"}
        </Button>
      ) : (
        <Link
          to={ROUTES.ACCOUNT.IMPORT.PASSPHRASE.RECOVERY.ROUTE}
          className={"account-import-passphrase__cta"}>
          {"Next"}
        </Link>
      )}
    </div>
  );

  function handleChangeView() {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        importAccountViews: "recovery"
      }
    });
  }
}

export default AccountImportPassphrase;
