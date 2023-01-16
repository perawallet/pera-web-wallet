import {ReactComponent as CloseIcon} from "../../../core/ui/icons/close.svg";

import "./_transaction-sign-error-state.scss";

import classNames from "classnames";

import Button from "../../../component/button/Button";
import LinkButton from "../../../component/button/LinkButton";
import ROUTES from "../../../core/route/routes";
import TransactionSignAppMeta from "../view/default/app-meta/TransactionSignAppMeta";

interface TransactionSignErrorStateProps {
  title: string;
  description: string;
  handleSignCancel: VoidFunction;
  shouldRenderSettingsLink?: boolean;
}

function TransactionSignErrorState({
  title,
  description,
  handleSignCancel,
  shouldRenderSettingsLink = false
}: TransactionSignErrorStateProps) {
  return (
    <div className={"transaction-sign-error-state"}>
      <TransactionSignAppMeta />

      <div className={"transaction-sign-error-state__content"}>
        <div className={"transaction-sign-error-state__content__message"}>
          <div className={"transaction-sign-error-state__error-icon-wrapper"}>
            <CloseIcon />
          </div>

          <h1 className={"typography--h2 transaction-sign-error-state__title"}>
            {title}
          </h1>

          <p className={"text-color--gray"}>{description}</p>
        </div>

        <div
          className={classNames("transaction-sign-error-state__actions", {
            "transaction-sign-error-state__actions--with-settings-link":
              shouldRenderSettingsLink
          })}>
          <Button
            onClick={handleSignCancel}
            customClassName={"transaction-sign-error-state__actions__button"}
            buttonType={"light"}>
            {"Close"}
          </Button>

          {shouldRenderSettingsLink && (
            <LinkButton
              to={ROUTES.SETTINGS.ROUTE}
              target={"_blank"}
              customClassName={"transaction-sign-error-state__actions__button"}>
              {"Change Node on Pera Web"}
            </LinkButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionSignErrorState;
