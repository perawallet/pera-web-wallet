import "./_modal.scss";

import ReactModal from "react-modal";
import classNames from "classnames";

import {MODAL_CLOSE_TIMEOUT} from "./util/modalConstants";
import {ModalPosition} from "./util/modalTypes";

interface ModalProps {
  isOpen: boolean;
  modalContentLabel: string;
  onClose: (...args: any[]) => void;
  onAfterOpen?: (...args: any[]) => void;
  onAfterClose?: (...args: any[]) => void;
  closeTimeout?: number;
  shouldCloseOnOverlayClick?: boolean;
  customClassName?: string;
  customOverlayClassName?: string;
  children?: React.ReactNode;
  shouldCloseOnEsc?: boolean;
  bodyOpenClassName?: string;
  portalClassName?: string;
  position?: ModalPosition;
}

ReactModal.defaultStyles = {};
ReactModal.setAppElement("#root");

function getParent() {
  return document.querySelector("#modal-root") as HTMLElement;
}

function Modal({
  isOpen,
  customClassName,
  children,
  closeTimeout = MODAL_CLOSE_TIMEOUT,
  modalContentLabel,
  onAfterClose,
  onAfterOpen,
  customOverlayClassName,
  shouldCloseOnOverlayClick = true,
  shouldCloseOnEsc = true,
  bodyOpenClassName,
  onClose,
  portalClassName,
  position = "center"
}: ModalProps) {
  const containerClassName = classNames("ReactModal__Content", customClassName);
  const bodyClassName = classNames("ReactModal__Body--open", bodyOpenClassName);
  const overlayClassName = classNames(
    `ReactModal__Overlay--position--${position}`,
    customOverlayClassName
  );

  return (
    <ReactModal
      parentSelector={getParent}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onAfterClose={onAfterClose}
      contentLabel={modalContentLabel}
      className={containerClassName}
      portalClassName={portalClassName}
      onRequestClose={handleRequestClose}
      overlayClassName={overlayClassName}
      closeTimeoutMS={closeTimeout}
      bodyOpenClassName={bodyClassName}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      shouldCloseOnEsc={shouldCloseOnEsc}>
      <div className={"modal__body"}>{children}</div>
    </ReactModal>
  );

  function handleRequestClose() {
    if (onClose && (shouldCloseOnOverlayClick || shouldCloseOnEsc)) {
      onClose();
    }
  }
}

export default Modal;
export type {ModalProps};
