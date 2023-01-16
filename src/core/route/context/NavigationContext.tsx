import React, {createContext, useContext, useLayoutEffect} from "react";
import {Location} from "react-router-dom";

import {useAppContext} from "../../app/AppContext";
import {FormitoReducerAction} from "../../util/hook/formito/formitoStateReducer";
import useFormito from "../../util/hook/formito/useFormito";
import useLocationWithState from "../../util/hook/useLocationWithState";
import ROUTES from "../routes";

type NavigationState = {
  headerGoBackLink: string;
};

const NavigationContext = createContext(
  {} as {
    navigationState: NavigationState;
    dispatchNavigationStateAction: React.Dispatch<FormitoReducerAction<NavigationState>>;
  }
);

function NavigationContextProvider({children}: {children: React.ReactNode}) {
  const {
    state: {hasAccounts}
  } = useAppContext();
  const {formitoState, dispatchFormitoAction} = useFormito<NavigationState>({
    headerGoBackLink: hasAccounts ? ROUTES.OVERVIEW.ROUTE : ROUTES.BASE
  });

  return (
    <NavigationContext.Provider
      value={{
        navigationState: formitoState,
        dispatchNavigationStateAction: dispatchFormitoAction
      }}>
      {children}
    </NavigationContext.Provider>
  );
}

function useNavigationContext() {
  return useContext(NavigationContext);
}

function withGoBackLink<P extends Record<string, any>>(
  WrappedFlow: React.FC<P>,
  link?: string
) {
  return (props: P) => {
    const {dispatchNavigationStateAction} = useNavigationContext();
    const {from} = useLocationWithState<{from?: Location}>();
    const headerGoBackLink = link || from?.pathname;

    useLayoutEffect(() => {
      if (headerGoBackLink) {
        dispatchNavigationStateAction({
          type: "SET_FORM_VALUE",
          payload: {headerGoBackLink}
        });
      }
    }, [dispatchNavigationStateAction, headerGoBackLink]);

    return <WrappedFlow {...props} />;
  };
}

export default NavigationContextProvider;
export {useNavigationContext, withGoBackLink};
