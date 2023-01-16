import {createContext, Dispatch, useContext} from "react";

import {ModalStackItem} from "../util/modalTypes";

interface ModalState {
  modalStack: ModalStackItem[];
}

const initialModalState: ModalState = {
  modalStack: []
};

type ModalStateAction =
  | {
      type: "OPEN_MODAL";
      payload: {
        item: ModalStackItem;
      };
    }
  | {
      type: "CLOSE_MODAL";
      payload: {
        id: string;
      };
    }
  | {
      type: "CLOSE_ALL_MODALS";
    }
  | {
      type: "CLEAN_MODAL_STACK";
    };

function modalStateReducer(state = initialModalState, action: ModalStateAction) {
  let newState = state;

  switch (action.type) {
    case "OPEN_MODAL": {
      if (state.modalStack.find((item) => item.id === action.payload.item.id)) {
        const filteredModalStack = state.modalStack.filter(
          (item) => item.id !== action.payload.item.id
        );

        newState = {
          modalStack: [
            {
              ...action.payload.item,
              isOpen: true
            },
            ...filteredModalStack
          ]
        };
      } else {
        newState = {
          ...state,
          modalStack: [{...action.payload.item, isOpen: true}, ...state.modalStack]
        };
      }

      break;
    }

    case "CLOSE_MODAL": {
      const foundModal = state.modalStack.find((item) => item.id === action.payload.id);

      if (foundModal) {
        const filteredModalStack = state.modalStack.filter(
          (item) => item.id !== action.payload.id
        );

        newState = {
          ...state,
          modalStack: [
            {
              ...foundModal,
              isOpen: false
            },
            ...filteredModalStack
          ]
        };
      } else {
        throw new Error(
          `Modal cannot be found: ${
            action.payload.id
          }. \nAvailable modal ids: ${state.modalStack.map((item) => item.id)}`
        );
      }

      break;
    }

    case "CLOSE_ALL_MODALS": {
      newState = {
        ...state,
        modalStack: state.modalStack.map((item) => ({...item, isOpen: false}))
      };

      break;
    }

    case "CLEAN_MODAL_STACK": {
      newState = {
        ...state,
        modalStack: []
      };

      break;
    }

    default:
      break;
  }

  return newState;
}

const ModalStateContext = createContext(initialModalState);
const ModalDispatchContext = createContext(
  (() => undefined) as Dispatch<ModalStateAction>
);

ModalStateContext.displayName = "ModalStateContext";
ModalDispatchContext.displayName = "ModalDispatchContext";

function useModalStateContext() {
  return useContext(ModalStateContext);
}

function useModalDispatchContext() {
  return useContext(ModalDispatchContext);
}

export {
  initialModalState,
  ModalStateContext,
  ModalDispatchContext,
  modalStateReducer,
  useModalStateContext,
  useModalDispatchContext
};
