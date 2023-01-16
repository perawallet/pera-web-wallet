type FormitoReducerAction<T> =
  | {
      type: "SET_FORM_VALUE";
      payload: Partial<T>;
    }
  | {type: "RESET_FORM_STATE"; state: T};

function formitoStateReducer<T>(state: T, action: FormitoReducerAction<T>): T {
  let newState = state;

  switch (action.type) {
    case "SET_FORM_VALUE": {
      newState = {
        ...state,
        ...action.payload
      };

      break;
    }

    case "RESET_FORM_STATE": {
      newState = action.state;
      break;
    }

    default:
      break;
  }

  return newState;
}

export default formitoStateReducer;
export type {FormitoReducerAction};
