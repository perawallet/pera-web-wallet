import algosdk, {Account} from "algosdk";
import {Routes, Route, Navigate} from "react-router-dom";
import {createContext, useContext, useMemo} from "react";

import AccountCreate from "../../page/create/AccountCreate";
import ROUTES from "../../../core/route/routes";
import AccountSuccessPage from "../../page/success/AccountSuccessPage";
import CardLayout from "../../../layouts/card-layout/CardLayout";
import AccountCreationAnimation from "../../component/account-creation-animation/AccountCreationAnimation";
import NavigateFlow from "../../../core/route/navigate/NavigateFlow";
import {withGoBackLink} from "../../../core/route/context/NavigationContext";
import AccountPassphraseModal from "../../component/account-passphrase-modal/AccountPassphraseModal";

type AccountCreateContextType = {account: Account};

const AccountCreateContext = createContext({} as AccountCreateContextType);

function AccountCreateContextProvider({children}: {children: React.ReactNode}) {
  const generatedAccount = useMemo(() => algosdk.generateAccount(), []);

  return (
    <AccountCreateContext.Provider value={{account: generatedAccount}}>
      {children}
    </AccountCreateContext.Provider>
  );
}

function useAccountCreateContext() {
  const context = useContext(AccountCreateContext);

  return context;
}

function AccountCreateFlow() {
  return (
    <AccountCreateContextProvider>
      <Routes>
        <Route element={<CardLayout />}>
          <Route index={true} element={<AccountCreate />} />

          <Route
            path={`${ROUTES.ACCOUNT.CREATE.PASSPHRASE.ROUTE}`}
            element={
              <NavigateFlow to={ROUTES.ACCOUNT.ROUTE}>
                <AccountPassphraseModal />
              </NavigateFlow>
            }
          />

          <Route
            path={`${ROUTES.ACCOUNT.CREATE.PENDING.ROUTE}`}
            element={
              <NavigateFlow to={ROUTES.ACCOUNT.ROUTE}>
                <AccountCreationAnimation type={"CREATE"} />
              </NavigateFlow>
            }
          />

          <Route path={"*"} element={<Navigate to={ROUTES.PASSWORD.ROUTE} />} />
        </Route>

        <Route
          path={`${ROUTES.ACCOUNT.CREATE.SUCCESS.ROUTE}`}
          element={
            <NavigateFlow to={ROUTES.ACCOUNT.ROUTE}>
              <AccountSuccessPage type={"CREATE"} />
            </NavigateFlow>
          }
        />
      </Routes>
    </AccountCreateContextProvider>
  );
}

export {useAccountCreateContext, AccountCreateContextProvider};
export default withGoBackLink(AccountCreateFlow);
