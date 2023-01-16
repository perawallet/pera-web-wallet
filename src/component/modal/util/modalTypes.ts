import {ModalProps} from "../Modal";

type ModalPosition =
  | "center"
  | "top"
  | "top-left"
  | "top-right"
  | "right-center"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left"
  | "left-center";

interface ModalStackItem extends Omit<ModalProps, "onClose" | "isOpen"> {
  id: string;
  isOpen?: boolean;
  onClose?: ModalProps["onClose"];
}

export type {ModalPosition, ModalStackItem};
