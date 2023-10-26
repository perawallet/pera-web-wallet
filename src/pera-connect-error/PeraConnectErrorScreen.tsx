import {ReactComponent as CloseIcon} from "../core/ui/icons/close.svg";
import {ReactComponent as HelpIcon} from "../core/ui/icons/help.svg";
import {ReactComponent as ExportIcon} from "../core/ui/icons/export.svg";

import "./_pera-connect-error-screen.scss";

import {useSearchParams} from "react-router-dom";
import classNames from "classnames";
import {List} from "@hipo/react-ui-toolkit";

import {PERA_CONNECT_ERROR_SCREEN_RESOLVED_BY_ITEMS} from "./util/peraConnectErrorScreenConstants";
import LinkButton from "../component/button/LinkButton";

interface PeraConnectErrorScreenProps {
  type?: "default" | "embedded";
}

function PeraConnectErrorScreen({type = "default"}: PeraConnectErrorScreenProps) {
  const [searchParams] = useSearchParams();
  const isCompactMode = searchParams.get("compactMode");

  return (
    <div
      className={classNames(
        "pera-connect-error-screen",
        `pera-connect-error-screen--${type}`,
        {
          "pera-connect-error-screen--compact": isCompactMode
        }
      )}>
      <div className={"pera-connect-error-screen-content"}>
        <div className={"pera-connect-error-screen__error-icon-wrapper"}>
          <CloseIcon width={30} height={30} />
        </div>

        <h1 className={"typography--h2 pera-connect-error-screen__title"}>
          {"Could not connect to Pera Web"}
        </h1>

        <p className={"text-color--gray"}>
          {"There was an issue connecting to Pera Web."}

          <br />

          {"This can be resolved by:"}
        </p>

        <List
          customClassName={"pera-connect-error-screen__resolved-by-list"}
          items={PERA_CONNECT_ERROR_SCREEN_RESOLVED_BY_ITEMS}>
          {(item) => (
            <a
              className={"pera-connect-error-screen__resolved-by-list__item"}
              href={item.link}
              target={"_blank"}
              rel={"noreferrer"}>
              <HelpIcon />

              <div>
                <h1
                  className={
                    "typography--button pera-connect-error-screen__resolved-by-list__item__title"
                  }>
                  {item.title}

                  <ExportIcon width={16} height={16} />
                </h1>

                <p className={"typography--tiny text-color--gray-lighter"}>
                  {item.description}
                </p>
              </div>
            </a>
          )}
        </List>
      </div>

      <div className={"pera-connect-error-screen__actions"}>
        <p
          className={"text-color--gray pera-connect-error-screen__actions__support-text"}>
          {`Please close this ${type === "default" ? "tab" : "modal"} and try again.`}
        </p>

        <LinkButton
          to={"https://perawallet.app/support/"}
          customClassName={
            "button--fluid pera-connect-error-screen__actions__contact-support-button"
          }
          buttonType={"light"}
          size={"large"}
          external={true}
          target={"_blank"}
          rel={"noreferrer"}>
          {"Contact Support"}
        </LinkButton>
      </div>
    </div>
  );
}

export default PeraConnectErrorScreen;
