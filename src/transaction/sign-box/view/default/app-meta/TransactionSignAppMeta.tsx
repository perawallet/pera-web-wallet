import {ReactComponent as AccountDefaultIcon} from "../../../../../core/ui/icons/account-default.svg";
import {ReactComponent as ChevronRight} from "../../../../../core/ui/icons/chevron-right.svg";
import {ReactComponent as DAppIcon} from "../../../../../core/ui/icons/dapp.svg";

import "./_transaction-sign-app-meta.scss";

import {trimAccountAddress} from "../../../../../account/util/accountUtils";
import Image from "../../../../../component/image/Image";
import {useTransactionSignFlowContext} from "../../../../context/TransactionSignFlowContext";

function TransactionSignAppMeta() {
  const {
    formitoState: {currentSession, userAccountName, userAddress}
  } = useTransactionSignFlowContext();

  return (
    <div className={"align-center--vertically transaction-sign-app-meta"}>
      <div className={"transaction-sign-app-meta__information"}>
        {currentSession?.favicon ? (
          <Image
            customClassName={"transaction-sign-app-meta__favicon"}
            src={currentSession!.favicon}
            alt={currentSession!.title}
          />
        ) : (
          <DAppIcon className={"transaction-sign-app-meta__favicon"} />
        )}

        <div className={"transaction-sign-app-meta__dapp-details"}>
          <p
            className={
              "text-color--gray typography--bold-tiny transaction-sign-app-meta__title text--truncated"
            }
            title={currentSession!.title}>
            {currentSession!.title}
          </p>

          <a
            className={
              "text-color--gray-light typography--tiny transaction-sign-app-meta__url text--truncated"
            }
            href={currentSession!.url}
            target={"_blank"}
            rel={"noopener noreferrer"}
            title={currentSession!.url}>
            {currentSession!.url}
          </a>
        </div>
      </div>

      <ChevronRight width={20} height={20} />

      <div className={"transaction-sign-app-meta__signer-account-details"}>
        <AccountDefaultIcon width={28} height={28} />

        <div>
          <p className={"text-color--gray typography--bold-tiny"}>{userAccountName}</p>

          <p className={"text-color--gray-light typography--tiny"}>
            {trimAccountAddress(userAddress)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TransactionSignAppMeta;
