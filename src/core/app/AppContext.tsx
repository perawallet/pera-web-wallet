import {createContext, Dispatch, ReactNode, useContext, useReducer} from "react";

import {AppState, appStateReducer, AppStateReducerAction} from "./appStateReducer";

const initialAppContextValue = {
  state: {} as AppState,
  dispatch: (() => undefined) as Dispatch<AppStateReducerAction>
};

const AppContext = createContext(initialAppContextValue);

AppContext.displayName = "AppContext";

function AppContextProvider({
  initialAppStateFromDB,
  children
}: {
  initialAppStateFromDB: AppState;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(appStateReducer, initialAppStateFromDB);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch
      }}>
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const {dispatch, state} = useContext(AppContext);

  return {dispatch, state};
}

export {AppContext, AppContextProvider, useAppContext};
