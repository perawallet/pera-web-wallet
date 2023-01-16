import {ReactComponent as CloseIcon} from "../../core/ui/icons/close.svg";
import {ReactComponent as KeyIcon} from "../../core/ui/icons/key.svg";
import {ReactComponent as InfoIcon} from "../../core/ui/icons/info.svg";

import "./_pera-toast.scss";

import {Toast} from "@hipo/react-ui-toolkit";
import classNames from "classnames";
import {Fragment} from "react";

export interface PeraToastProps {
  title: string;
  detail: string;
  customClassName?: string;
  type?: "success" | "error" | "warning" | "info";
  hasCloseButton?: boolean;
  learnMoreLink?: string;
}

function PeraToast({
  title,
  detail,
  type = "info",
  learnMoreLink,
  customClassName,
  hasCloseButton = true
}: PeraToastProps) {
  const peraToastClassNames = classNames(
    "pera-toast",
    `pera-toast--${type}`,
    "pera-toast--animation",
    customClassName,
    {"pera-toast--small": !hasCloseButton}
  );

  return (
    <div className={peraToastClassNames}>
      {renderIcon()}

      <div>
        <p className={"typography--medium-body pera-toast__title"}>{title}</p>

        <p
          className={
            "typography--secondary-body text-color--gray pera-toast__description"
          }>
          {detail}
        </p>

        {learnMoreLink && (
          <a
            href={learnMoreLink}
            target={"_blank"}
            rel={"noreferrer"}
            className={
              "typography--secondary-bold-body text-color--main pera-toast__learn-more"
            }>
            {"Learn more →"}
          </a>
        )}
      </div>

      {hasCloseButton && (
        <Toast.CloseButton>
          <CloseIcon />
        </Toast.CloseButton>
      )}
    </div>
  );

  function renderIcon() {
    let icon = <Fragment />;

    if (type === "info") {
      icon = <KeyIcon width={16} height={16} />;
    } else if (type === "warning") {
      icon = <InfoIcon width={16} height={16} />;
    }

    return (
      <div
        className={classNames(
          "align-center--horizontally",
          "pera-toast__icon-wrapper",
          `pera-toast__icon-wrapper--${type}`
        )}>
        {icon}
      </div>
    );
  }
}

export default PeraToast;
