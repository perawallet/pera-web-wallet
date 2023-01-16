import {useContext, useCallback} from "react";

import {generateRandomString} from "../../../core/util/string/stringUtils";
import {SimpleToastItemContext} from "../SimpleToastItemContext";
import {
  SimpleToastDispatchContext,
  SimpleToastStateContext
} from "../SimpleToastProvider";
import {SimpleToastContextState, SimpleToastData} from "./simpleToastTypes";

/**
 * @returns {Object} Current value of SimpleToastContextState
 */
function useSimpleToastContextState(): SimpleToastContextState {
  const state = useContext(SimpleToastStateContext);

  if (!state) {
    throw new Error("Trying to consume ToastStateContext outside of its provider.");
  }

  return state;
}

function useSimpleToaster() {
  const dispatch = useContext(SimpleToastDispatchContext);

  if (!dispatch) {
    throw new Error("Trying to consume ToastDispatchContext outside of its provider");
  }

  return {
    /**
     * Display a Toast
     * @returns {string} Toast's id
     */
    display: useCallback(
      (toastData: SimpleToastData) => {
        const toastId = toastData.id || generateRandomString();

        dispatch({
          type: "DISPLAY",
          toastData: {
            ...toastData,
            id: toastId
          }
        });

        return toastId;
      },
      [dispatch]
    ),
    /**
     * Hide a Toast
     */
    hide: useCallback(() => {
      dispatch({
        type: "HIDE"
      });
    }, [dispatch])
  };
}

function useToastItemContext() {
  const toastItemContext = useContext(SimpleToastItemContext);

  if (!toastItemContext) {
    throw new Error("Trying to consume ToastItemContext outside of its provider");
  }

  return toastItemContext;
}

export {useSimpleToastContextState, useSimpleToaster, useToastItemContext};
