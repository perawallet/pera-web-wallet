import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useLayoutEffect,
  useReducer
} from "react";

import webStorage, {STORED_KEYS} from "../util/storage/web/webStorage";
import {AppState, appStateReducer, AppStateReducerAction} from "./appStateReducer";
import {getSystemTheme, isEmbeddedConnectFlows} from "./util/appStateUtils";

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
  const {theme} = state;

  useLayoutEffect(() => {
    webStorage.local.setItem(STORED_KEYS.THEME, theme);

    let appTheme = theme;

    if (theme === "system") {
      appTheme = getSystemTheme();
    }

    if (isEmbeddedConnectFlows()) {
      appTheme = "light";
    }

    document.documentElement.classList.add(`${appTheme}-theme`);

    return () => {
      document.documentElement.classList.remove(`${appTheme}-theme`);
    };
  }, [theme]);

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
