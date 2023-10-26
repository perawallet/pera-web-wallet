import {ReactComponent as ChevronRight} from "../../../../../core/ui/icons/chevron-right.svg";
import {ReactComponent as DAppIcon} from "../../../../../core/ui/icons/dapp.svg";

import "./_transaction-sign-app-meta.scss";

import classNames from "classnames";
import {useSearchParams} from "react-router-dom";

import {trimAccountAddress} from "../../../../../account/util/accountUtils";
import Image from "../../../../../component/image/Image";
import {useTransactionSignFlowContext} from "../../../../context/TransactionSignFlowContext";
import useAccountIcon from "../../../../../core/util/hook/useAccountIcon";
import {getFirstChars} from "../../../../../core/util/string/stringUtils";

const DAPP_FAVICON_PLACEHOLDER_CHAR_COUNT = 2;

function TransactionSignAppMeta() {
  const {
    formitoState: {currentSession, userAccountName, userAddress, accounts}
  } = useTransactionSignFlowContext();
  const {renderAccountIcon} = useAccountIcon();
  const [searchParams] = useSearchParams();
  const isCompactMode = searchParams.get("compactMode");

  return (
    <div
      className={classNames("align-center--vertically transaction-sign-app-meta", {
        "transaction-sign-app-meta--compact": isCompactMode
      })}>
      <div className={"transaction-sign-app-meta__information"}>
        {currentSession?.favicon ? (
          <Image
            customClassName={"transaction-sign-app-meta__favicon"}
            customPlaceholder={
              <div className={"transaction-sign-app-meta__favicon__placeholder"}>
                {getFirstChars(
                  currentSession!.title,
                  DAPP_FAVICON_PLACEHOLDER_CHAR_COUNT
                )}
              </div>
            }
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
              "text-color--gray-lighter typography--tiny transaction-sign-app-meta__url text--truncated"
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
        {renderAccountIcon({
          account: accounts[userAddress],
          size: 28
        })}

        {userAddress && (
          <div>
            <p className={"text-color--gray typography--bold-tiny"}>{userAccountName}</p>

            <p className={"text-color--gray-light typography--tiny"}>
              {trimAccountAddress(userAddress)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionSignAppMeta;
