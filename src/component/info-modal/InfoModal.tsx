import "./_info-modal.scss";

import {ReactNode} from "react";
import {List, ListItem} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import webStorage from "../../core/util/storage/web/webStorage";
import Button from "../button/Button";
import {useModalDispatchContext} from "../modal/context/ModalContext";

interface InfoModalProps {
  modalId: string;
  iconHeader?: ReactNode;
  title?: string;
  subtitle?: string;
  infoItems: {id: string; icon?: ReactNode; description: ReactNode}[];
  confirmationText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  displayDontShowAgain?: {webStorageKey: string};
  footer?: ReactNode;
  customClassName?: string;
}

function InfoModal({
  modalId,
  iconHeader,
  title,
  subtitle,
  infoItems,
  confirmationText,
  cancelText,
  onConfirm,
  displayDontShowAgain,
  footer,
  customClassName
}: InfoModalProps) {
  const dispatchModalStateAction = useModalDispatchContext();
  const infoModalClassname = classNames("info-modal-wrapper", customClassName);

  return (
    <div className={infoModalClassname}>
      {iconHeader && <div className={"info-modal__icon-wrapper"}>{iconHeader}</div>}

      {title && (
        <h2
          className={"typography--h2 text-color--main text--centered info-modal__title"}>
          {title}
        </h2>
      )}

      {subtitle && (
        <p
          className={
            "typography--body text-color--gray-lighter text--centered info-modal__subtitle"
          }>
          {subtitle}
        </p>
      )}

      <div className={"info-modal__description-box"}>
        <List items={infoItems}>
          {({icon, description}) => (
            <ListItem customClassName={"info-modal__description-list-item"}>
              {icon && (
                <div className={"info-modal__description-list-item__icon-wrapper"}>
                  {icon}
                </div>
              )}

              <div className={"info-modal__description"}>{description}</div>
            </ListItem>
          )}
        </List>
      </div>

      {footer && <div className={"info-modal__footer"}>{footer}</div>}

      <div className={"info-modal__cta-group"}>
        <Button
          buttonType={"primary"}
          size={"large"}
          customClassName={"button--fluid info-modal__continue-cta"}
          onClick={handleOnConfirm}>
          {confirmationText || "Continue"}
        </Button>

        {displayDontShowAgain && (
          <Button
            buttonType={"light"}
            size={"large"}
            customClassName={"button--fluid"}
            onClick={handleDontShowAgainClick}>
            {cancelText || "Don't show again"}
          </Button>
        )}
      </div>
    </div>
  );

  function handleOnConfirm() {
    handleCloseModal();

    if (onConfirm) {
      onConfirm();
    }
  }

  function handleDontShowAgainClick() {
    if (!displayDontShowAgain) return;

    webStorage.local.setItem(displayDontShowAgain.webStorageKey, true);

    handleOnConfirm();
  }

  function handleCloseModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {id: modalId}
    });
  }
}

export default InfoModal;
