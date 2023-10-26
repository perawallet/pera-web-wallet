import "./_account-import-backup-prepare.scss";

import {ReactComponent as BackupIcon} from "../../../../../core/ui/icons/backup.svg";

import {Link} from "react-router-dom";

import ROUTES from "../../../../../core/route/routes";
import Button from "../../../../../component/button/Button";
import {AccountComponentFlows} from "../../../../util/accountTypes";
import {useConnectFlowContext} from "../../../../../connect/context/ConnectFlowContext";

export interface AccountImportbackupProps {
  flow?: AccountComponentFlows;
}

function AccountImportBackupPrepare({flow = "default"}: AccountImportbackupProps) {
  const {dispatchFormitoAction} = useConnectFlowContext();

  return (
    <div className={"account-import-backup-prepare"}>
      <div className={"account-import-backup-prepare__icon-wrapper"}>
        <BackupIcon width={56} height={56} />
      </div>

      <h1 className={"typography--h2 text-color--main"}>
        {"Import Algorand Secure Backup"}
      </h1>

      <p className={"text-color--gray account-import-backup-prepare__description"}>
        {"Import accounts with your Algorand Secure Backup file and your 12-word key. "}

        <a
          target={"_blank"}
          rel={"noopener noreferrer"}
          href={"https://perawallet.app/learn"}
          className={"typography--body account-import-backup-prepare__description-link"}>
          {"Learn More"}
        </a>

        {" with Pera Learn."}
      </p>

      {flow === "connect" ? (
        <Button
          customClassName={"account-import-backup-prepare__cta"}
          onClick={handleChangeView}>
          {"Next"}
        </Button>
      ) : (
        <Link
          to={ROUTES.ACCOUNT.IMPORT.BACKUP.FILE.ROUTE}
          className={"account-import-backup-prepare__cta"}>
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

export default AccountImportBackupPrepare;
