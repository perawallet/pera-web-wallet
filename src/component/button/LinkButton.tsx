import React from "react";
import {Link, LinkProps} from "react-router-dom";
import classNames from "classnames";

import {ButtonProps} from "./Button";

// This SCSS file is imported to the app under index.tsx
// import "./_button.scss";

export type LinkButtonProps = Omit<LinkProps, "className"> &
  Pick<ButtonProps, "buttonType" | "size" | "customClassName"> & {
    isDisabled?: boolean;
    to: LinkProps["to"];
    external?: boolean;
  };

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  // eslint-disable-next-line prefer-arrow-callback
  function LinkButtonComponent(props, ref) {
    const {
      buttonType = "primary",
      size = "medium",
      isDisabled = false,
      external = false,
      customClassName,
      ...otherProps
    } = props;
    const linkButtonClassname = classNames(
      `button`,
      `button--${buttonType}`,
      `button--${size}`,
      `typography--button`,
      {
        "button--is-inactive": isDisabled
      },
      `link-button`,
      customClassName
    );

    if (external) {
      return (
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        <a
          href={otherProps.to as string}
          className={linkButtonClassname}
          rel={"noopener noreferrer"}
          target={"_blank"}
          {...otherProps}
        />
      );
    }

    return <Link ref={ref} className={linkButtonClassname} {...otherProps} />;
  }
);

export default LinkButton;
