import {initialSimpleToastState} from "./simpleToastConstants";
import {SimpleToastAction} from "./simpleToastTypes";

type SimpleToastState = typeof initialSimpleToastState;

function simpleToastReducer(
  state: SimpleToastState,
  action: SimpleToastAction
): SimpleToastState {
  let newState = state;

  switch (action.type) {
    case "DISPLAY": {
      newState = {
        ...state,
        toast: action.toastData
      };
      break;
    }

    case "HIDE": {
      newState = {
        ...state,
        toast: null
      };
      break;
    }

    case "SET_DEFAULT_AUTO_CLOSE_TIMEOUT": {
      newState = {
        ...state,
        defaultAutoCloseTimeout: action.timeout
      };
      break;
    }

    default:
      break;
  }

  return newState;
}

export default simpleToastReducer;
