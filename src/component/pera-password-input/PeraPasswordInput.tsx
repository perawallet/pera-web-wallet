import {Button, Input, PasswordInputProps} from "@hipo/react-ui-toolkit";
import classNames from "classnames";
import {useState} from "react";

import "./_pera-password-input.scss";

export interface PeraPasswordInputProps extends Omit<PasswordInputProps, "leftIcon"> {
  infoIcon?: React.ReactNode;
}

function PeraPasswordInput({
  customClassName,
  hideIcon,
  revealIcon,
  infoIcon,
  ...rest
}: PeraPasswordInputProps) {
  const [isPasswordShown, setPasswordVisibility] = useState(false);
  const peraPasswordInputClassName = classNames("pera-password-input", customClassName);
  let iconAriaLabel = "Show password";
  let icon = revealIcon;
  let inputType: "password" | "text" = "password";

  if (isPasswordShown) {
    iconAriaLabel = "Hide password";
    icon = hideIcon;
    inputType = "text";
  }

  return (
    <Input
      type={inputType}
      customClassName={peraPasswordInputClassName}
      rightIcon={
        icon && (
          <Button
            tabIndex={-1}
            customClassName={"pera-password-input__icon"}
            aria-label={iconAriaLabel}
            onClick={togglePasswordVisibility}
            shouldStopPropagation={false}
            shouldPreventDefault={false}>
            <>
              {infoIcon && (
                <span className={"pera-password-input__info-icon"}>{infoIcon}</span>
              )}
              <span className={"pera-password-input__visibility-icon"}>{icon}</span>
            </>
          </Button>
        )
      }
      {...rest}
    />
  );

  function togglePasswordVisibility() {
    setPasswordVisibility(!isPasswordShown);
  }
}

export default PeraPasswordInput;
