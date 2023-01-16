import React, {createContext, useReducer, useEffect} from "react";

import SimpleToast from "./SimpleToast";
import {
  DEFAULT_SIMPLE_TOAST_TIMEOUT,
  initialSimpleToastState
} from "./util/simpleToastConstants";
import simpleToastReducer from "./util/simpleToastReducer";
import {SimpleToastAction, SimpleToastContextState} from "./util/simpleToastTypes";

const SimpleToastStateContext = createContext<null | SimpleToastContextState>(null);
const SimpleToastDispatchContext =
  createContext<null | React.Dispatch<SimpleToastAction>>(null);

SimpleToastDispatchContext.displayName = "ToastDispatchContext";
SimpleToastStateContext.displayName = "ToastStateContext";

interface ToastContextProviderProps {
  children: React.ReactNode;
  defaultAutoCloseTimeout?: number;
}

/**
 * Wraps its children in a context provider
 * these children can then use the useSimpleToast hook to show toast message
 */

function SimpleToastContextProvider({
  children,
  defaultAutoCloseTimeout = DEFAULT_SIMPLE_TOAST_TIMEOUT
}: ToastContextProviderProps) {
  const [state, dispatch] = useReducer(simpleToastReducer, {
    ...initialSimpleToastState,
    defaultAutoCloseTimeout
  });

  useEffect(() => {
    dispatch({
      type: "SET_DEFAULT_AUTO_CLOSE_TIMEOUT",
      timeout: defaultAutoCloseTimeout
    });
  }, [defaultAutoCloseTimeout]);

  return (
    <SimpleToastStateContext.Provider value={state}>
      <SimpleToastDispatchContext.Provider value={dispatch}>
        {children}

        <SimpleToast data={state.toast} />
      </SimpleToastDispatchContext.Provider>
    </SimpleToastStateContext.Provider>
  );
}

export {SimpleToastDispatchContext, SimpleToastStateContext, SimpleToastContextProvider};
