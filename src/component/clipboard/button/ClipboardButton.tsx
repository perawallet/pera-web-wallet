import "./_clipboard-button.scss";

import {ReactComponent as CopyIcon} from "../../../core/ui/icons/copy.svg";

import classNames from "classnames";

import Button, {ButtonProps} from "../../button/Button";
import useClipboard from "../useClipboard";
import {useSimpleToaster} from "../../simple-toast/util/simpleToastHooks";

type ClipboardButtonProps = Omit<ButtonProps, "children"> & {
  textToCopy: string;
  children?: React.ReactNode;
  copiedMessage?: string;
  iconPosition?: "left" | "right";
};

function ClipboardButton({
  textToCopy,
  copiedMessage,
  iconPosition = "left",
  children,
  "aria-label": ariaLabel,
  customClassName,
  ...otherProps
}: ClipboardButtonProps) {
  const clipboard = useClipboard();
  const simpleToaster = useSimpleToaster();

  return (
    <Button
      customClassName={classNames("clipboard-button button--fluid", customClassName)}
      aria-label={ariaLabel || "Copy to clipboard"}
      onClick={copy}
      {...otherProps}>
      <div className={"clipboard-button__content"}>
        {iconPosition === "left" && <CopyIcon width={16} height={16} />}

        {children && (
          <span className={"clipboard-button__content__text"}>{children}</span>
        )}

        {iconPosition === "right" && <CopyIcon width={16} height={16} />}
      </div>
    </Button>
  );

  function copy() {
    clipboard.copyToClipboard(textToCopy);

    simpleToaster.display({
      message: copiedMessage || "Copied!",
      type: "success"
    });
  }
}

export default ClipboardButton;
