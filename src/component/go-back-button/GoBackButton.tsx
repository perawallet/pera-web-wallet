import {ReactComponent as ArrowLeftIcon} from "../../core/ui/icons/arrow-left.svg";

import "./_go-back-button.scss";

import {Link, To} from "react-router-dom";
import classNames from "classnames";

type GoBackButtonProps = {
  text?: string;
  to?: To;
  icon?: JSX.Element;
  iconPosition?: "left" | "right";

  children?: React.ReactNode;
  customClassName?: string;
};

function GoBackButton({
  text,
  to,
  icon = <ArrowLeftIcon />,
  iconPosition = "left",

  children,
  customClassName
}: GoBackButtonProps) {
  const goBackButtonContainerClassNames = classNames(
    "go-back-button-container",
    customClassName
  );

  const actionButton = (
    <Link to={to || (-1 as unknown as To)} className={"go-back-button"}>
      {icon}
    </Link>
  );

  return (
    <div className={goBackButtonContainerClassNames}>
      {iconPosition === "left" && actionButton}

      {text && (
        <span className={"typography--h2 text-color--main go-back-button__text"}>
          {text}
        </span>
      )}

      {iconPosition === "right" && actionButton}

      {children}
    </div>
  );
}

export default GoBackButton;
