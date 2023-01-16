import React, {useReducer} from "react";

import Modal from "../Modal";
import {
  initialModalState,
  ModalDispatchContext,
  ModalStateContext,
  modalStateReducer
} from "./ModalContext";

interface ModalContextProviderProps {
  children: React.ReactNode;
}

function ModalContextProvider({children}: ModalContextProviderProps) {
  const [modalState, dispatchModalStateAction] = useReducer(
    modalStateReducer,
    initialModalState
  );

  return (
    <ModalStateContext.Provider value={modalState}>
      <ModalDispatchContext.Provider value={dispatchModalStateAction}>
        {children}

        {modalState.modalStack.map(
          ({id, isOpen, children: modalChildren, customOverlayClassName, ...rest}) => (
            <React.Fragment key={id}>
              <Modal
                isOpen={isOpen!}
                onClose={handleCloseModal(id)}
                {...rest}
                customOverlayClassName={customOverlayClassName}>
                <div className={"modal-content"}>{modalChildren}</div>
              </Modal>
            </React.Fragment>
          )
        )}
      </ModalDispatchContext.Provider>
    </ModalStateContext.Provider>
  );

  function handleCloseModal(id: string) {
    return () =>
      dispatchModalStateAction({
        type: "CLOSE_MODAL",
        payload: {
          id
        }
      });
  }
}

export default ModalContextProvider;
