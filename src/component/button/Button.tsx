import React from "react";
import {
  Button as HipoButton,
  ButtonProps as HipoButtonProps
} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import SimpleLoader from "../loader/simple/SimpleLoader";

// This SCSS file is imported to the app under index.tsx
// import "./_button.scss";

export type ButtonProps = HipoButtonProps & {
  buttonType?: "primary" | "secondary" | "light" | "ghost" | "danger" | "custom";
  size?: "small" | "medium" | "large";
  shouldHideChildrenOnSpinnerView?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  // eslint-disable-next-line prefer-arrow-callback
  function ButtonComponent(props, ref) {
    const {
      buttonType = "primary",
      size = "medium",
      customClassName,
      children,
      shouldHideChildrenOnSpinnerView,
      shouldDisplaySpinner,
      ...otherProps
    } = props;
    const className = classNames(
      "typography--button",
      customClassName,
      `button--${buttonType}`,
      `button--${size}`,
      "typography--button"
    );
    const shouldHideChildren = shouldDisplaySpinner && shouldHideChildrenOnSpinnerView;

    return (
      <HipoButton
        ref={ref}
        customClassName={className}
        shouldDisplaySpinner={shouldDisplaySpinner}
        customSpinner={
          <SimpleLoader
            customClassName={classNames({
              "button__loader--align-right": !shouldHideChildren
            })}
            aria-label={"Button spinner visible. Button inactivated."}
          />
        }
        {...otherProps}>
        {shouldHideChildren ? null : children}
      </HipoButton>
    );
  }
);

export default Button;
