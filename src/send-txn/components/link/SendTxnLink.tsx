import "./_send-txn-link.scss";

import {ReactComponent as ChevronRightIcon} from "../../../core/ui/icons/chevron-right.svg";

import {Link, To} from "react-router-dom";
import classNames from "classnames";

import {trimAccountName} from "../../../account/util/accountUtils";

export interface SendTxnLinkProps {
  to: To;
  content: {
    label: string;
    name: string;
    icon?: React.ReactNode;
    placeholder?: string;
  };
  options?: {
    description?: React.ReactNode;
    placeholder?: React.ReactNode;
  };
  isDisabled?: boolean;
  customClassName?: string;
}

function SendTxnLink({
  to,
  content: {label, name, icon, placeholder},
  options = {},
  isDisabled = false,
  customClassName
}: SendTxnLinkProps) {
  const {description, placeholder: descriptionPlaceholder} = options;
  const sendTxnLinkClassnames = classNames(
    "typography--button form-field send-txn-link",
    customClassName,
    {
      "send-txn-link--disabled": isDisabled
    }
  );

  return (
    <Link to={to} className={sendTxnLinkClassnames}>
      <div>
        <p className={"send-txn-link__label typography--caption text-color--gray"}>
          {label}
        </p>

        {name && (
          <div className={"send-txn-link__name-row align-center--vertically"}>
            {icon || null}

            <p>{trimAccountName(name)}</p>
          </div>
        )}

        {!name && placeholder && (
          <p className={"send-texn-link__placeholder text-color--gray-lightest"}>
            {placeholder}
          </p>
        )}
      </div>

      {!isDisabled && (
        <div className={"send-txn-link__description-container align-center--vertically"}>
          {description && (
            <div className={"send-txn-link__description"}>{description}</div>
          )}

          {!description && descriptionPlaceholder && (
            <div className={"send-txn-link__description"}>{descriptionPlaceholder}</div>
          )}

          <ChevronRightIcon width={20} height={20} />
        </div>
      )}
    </Link>
  );
}

export default SendTxnLink;
