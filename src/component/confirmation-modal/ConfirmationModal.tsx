import "./_confirmation-modal.scss";

import {ReactComponent as InfoIcon} from "../../core/ui/icons/info.svg";

import Button from "../button/Button";
import {useModalDispatchContext} from "../modal/context/ModalContext";

type ConfirmationModalProps = {
  id: string;
  icon?: React.ReactNode;
  confirmText?: string;
  onConfirm: VoidFunction;
  cancelText?: string;
  onCancel?: VoidFunction;
  title: string;
  subtitle?: string;
};

function ConfirmationModal({
  id,
  icon,
  confirmText = "Confirm",
  onConfirm,
  cancelText = "Cancel",
  onCancel,
  title,
  subtitle
}: ConfirmationModalProps) {
  const dispatchModalAction = useModalDispatchContext();

  return (
    <div className={"confirmation-modal__wrapper"}>
      <div className={"confirmation-modal__body"}>
        <div className={"confirmation-modal__icon-wrapper"}>
          {icon || <InfoIcon width={48} height={48} />}
        </div>

        <h2 className={"typography--h2"}>{title}</h2>

        {subtitle && (
          <p className={"typography--body text-color--gray text--centered"}>{subtitle}</p>
        )}
      </div>

      <div className={"confirmation-modal__cta-group"}>
        <Button
          customClassName={"button--fluid"}
          onClick={handleOnConfirm}
          size={"large"}>
          {confirmText}
        </Button>

        <Button
          customClassName={"button--fluid"}
          onClick={handleOnCancel}
          size={"large"}
          buttonType={"light"}>
          {cancelText}
        </Button>
      </div>
    </div>
  );

  function handleOnConfirm() {
    handleCloseModal();
    onConfirm();
  }

  function handleOnCancel() {
    handleCloseModal();
    onCancel?.();
  }

  function handleCloseModal() {
    dispatchModalAction({type: "CLOSE_MODAL", payload: {id}});
  }
}

export default ConfirmationModal;
