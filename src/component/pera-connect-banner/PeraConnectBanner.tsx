import {ReactComponent as DAppIcon} from "../../core/ui/icons/dapp.svg";

import "./_pera-connect-banner.scss";

import classNames from "classnames";

import Image from "../image/Image";
import {getFirstChars} from "../../core/util/string/stringUtils";

interface PeraConnectBannerProps {
  currentSession: AppSession | null;
  customClassName?: string;
}

const DAPP_FAVICON_PLACEHOLDER_CHAR_COUNT = 2;

function PeraConnectBanner({currentSession, customClassName}: PeraConnectBannerProps) {
  return (
    <div className={classNames("pera-connect-banner", customClassName)}>
      {currentSession?.favicon ? (
        <Image
          customClassName={"pera-connect-banner__app-meta__favicon"}
          customPlaceholder={
            <div className={"pera-connect-banner__app-meta__favicon__placeholder"}>
              {getFirstChars(currentSession!.title, DAPP_FAVICON_PLACEHOLDER_CHAR_COUNT)}
            </div>
          }
          src={currentSession?.favicon || ""}
          alt={currentSession?.title || "dApp Favicon"}
        />
      ) : (
        <DAppIcon />
      )}

      <p>
        {"We will take you back to "}

        <span
          className={classNames({
            "typography--bold-body": currentSession
          })}>
          {currentSession?.title || "application"}
        </span>

        {" once you finish the process"}
      </p>
    </div>
  );
}

export default PeraConnectBanner;
