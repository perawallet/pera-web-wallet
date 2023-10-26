import {ReactComponent as PeraWebIcon} from "../../../../core/ui/icons/pera-web.svg";
import {ReactComponent as ChevronRightIcon} from "../../../../core/ui/icons/chevron-right.svg";

import "./_connect-page-embedded-view-add-import-account.scss";

import {useSearchParams} from "react-router-dom";
import classNames from "classnames";

import Button from "../../../../component/button/Button";
import PeraLoader from "../../../../component/loader/pera/PeraLoader";
import {useAppContext} from "../../../../core/app/AppContext";
import {ConnectPageEmbeddedViewPasswordCreateViews} from "../ConnectPageEmbeddedView";

interface ConnectPageEmbeddedViewAddImportAccountProps {
  view: ConnectPageEmbeddedViewPasswordCreateViews;
  handleChangeView: VoidFunction;
}

function ConnectPageEmbeddedViewAddImportAccount({
  view,
  handleChangeView
}: ConnectPageEmbeddedViewAddImportAccountProps) {
  const {
    state: {hashedMasterkey, hasAccounts}
  } = useAppContext();
  const userHasPasscodeButNoAccount = hashedMasterkey && !hasAccounts;
  const [searchParams] = useSearchParams();
  const isCompactMode = searchParams.get("compactMode");
  const description = userHasPasscodeButNoAccount
    ? "You haven't added any Algorand accounts yet."
    : "To start using Pera Wallet on your desktop, create or import an account.";

  if (view === "spinner") {
    return (
      <div className={"connect-page-embedded-view-add-import-account__spinner-wrapper"}>
        <PeraLoader mode={"colorful"} />
      </div>
    );
  }

  return (
    <div
      className={classNames("connect-page-embedded-view-add-import-account", {
        "connect-page-embedded-view-add-import-account--compact": isCompactMode
      })}>
      <div>
        <div className={"connect-page-embedded-view-add-import-account__icon-wrapper"}>
          <PeraWebIcon />
        </div>

        <p
          className={classNames(
            "text-color--gray connect-page-embedded-view-add-import-account__description",
            {
              "connect-page-embedded-view-add-import-account__description--no-account":
                userHasPasscodeButNoAccount
            }
          )}>
          {description}
        </p>
      </div>

      <Button
        customClassName={"connect-page-embedded-view-add-import-account__button"}
        buttonType={"primary"}
        onClick={handleChangeView}>
        {"Create or Import Account"}

        <ChevronRightIcon width={20} height={20} />
      </Button>
    </div>
  );
}

export default ConnectPageEmbeddedViewAddImportAccount;
