import "./_account-limit-warning-banner.scss";

import {ReactComponent as DangerIcon} from "../../../core/ui/icons/danger.svg";
import {ReactComponent as CloseIcon} from "../../../core/ui/icons/close.svg";

import {useEffect, useState} from "react";

import webStorage, {STORED_KEYS} from "../../../core/util/storage/web/webStorage";
import Button from "../../../component/button/Button";

const ACCOUNTS_WARNING_LIMIT = 50;

function AccountLimitWarningBanner({accountCount}: {accountCount: number}) {
  const [shouldDisplay, setShouldDisplay] = useState(true);

  useEffect(() => {
    if (
      accountCount < ACCOUNTS_WARNING_LIMIT &&
      webStorage.local.getItem(STORED_KEYS.HIDE_ACCOUNT_COUNT_WARNING_BANNER) === true
    ) {
      webStorage.local.setItem(STORED_KEYS.HIDE_ACCOUNT_COUNT_WARNING_BANNER, false);
    }
  }, [accountCount]);

  if (
    accountCount < ACCOUNTS_WARNING_LIMIT ||
    webStorage.local.getItem(STORED_KEYS.HIDE_ACCOUNT_COUNT_WARNING_BANNER) === true ||
    !shouldDisplay
  )
    return null;

  return (
    <div className={"account-limit-warning-banner"}>
      <div className={"account-limit-warning-banner__danger-icon-wrapper"}>
        <DangerIcon width={16} height={16} />
      </div>

      <div className={"account-limit-warning-banner__body"}>
        <p
          className={"typography--medium-body account-limit-warning-banner__body__title"}>
          {"Too many accounts"}
        </p>

        <p className={"typography--tiny text-color--gray"}>
          {`Having over ${ACCOUNTS_WARNING_LIMIT} accounts may lead to performance issues with Pera Wallet. Please remove some accounts for the best experience.`}
        </p>
      </div>

      <Button
        buttonType={"ghost"}
        size={"small"}
        customClassName={"account-limit-warning-banner__close-button"}
        onClick={handleCloseClick}>
        <CloseIcon width={16} height={16} />
      </Button>
    </div>
  );

  function handleCloseClick() {
    setShouldDisplay(false);

    webStorage.local.setItem(STORED_KEYS.HIDE_ACCOUNT_COUNT_WARNING_BANNER, true);
  }
}

export default AccountLimitWarningBanner;
