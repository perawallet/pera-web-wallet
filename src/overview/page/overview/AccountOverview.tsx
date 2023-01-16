import "./_account-overview.scss";

import {useEffect} from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useToaster} from "@hipo/react-ui-toolkit";

import {useAppContext} from "../../../core/app/AppContext";
import ROUTES from "../../../core/route/routes";
import AccountOverviewList from "./list/AccountOverviewList";
import AccountOverviewPortfolioValue from "./portfolio-value/AccountOverviewPortfolioValue";
import {usePortfolioContext} from "../../context/PortfolioOverviewContext";
import AccountOnboardingOptionList from "../../../account/component/onboarding-option-list/AccountOnboardingOptionList";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import PeraToast from "../../../component/pera-toast/PeraToast";
import {SECOND_IN_MS} from "../../../core/util/time/timeConstants";
import webStorage, {STORED_KEYS} from "../../../core/util/storage/web/webStorage";
import PeraLoader from "../../../component/loader/pera/PeraLoader";
import {trimAccountName} from "../../../account/util/accountUtils";
import useSetPageTitle from "../../../core/util/hook/useSetPageTitle";

const BACK_UP_ACCOUNTS_TIMEOUT = SECOND_IN_MS;

function AccountOverview() {
  const {
    state: {accounts, hasAccounts}
  } = useAppContext();
  const accountCount = Object.keys(accounts).length;
  const portfolioOverview = usePortfolioContext();
  const simpleToaster = useSimpleToaster();
  const toaster = useToaster();

  useSetPageTitle("Accounts");

  useEffect(() => {
    const createdNewAccount = webStorage.local.getItem(STORED_KEYS.CREATED_NEW_ACCOUNT);
    let timeout: NodeJS.Timeout;

    if (createdNewAccount) {
      simpleToaster.display({
        id: "backup-account-success-toast",
        message: `New account "${trimAccountName(String(createdNewAccount))}" created!`,
        type: "success"
      });

      setTimeout(() => {
        toaster.display({
          autoClose: false,
          id: "backup-account-warning-toast",
          render() {
            return (
              <PeraToast
                type={"info"}
                title={"Back-up your accounts"}
                detail={
                  "Record your account passphrase somewhere secure to ensure you always have access to this account."
                }
                learnMoreLink={
                  "https://support.perawallet.app/en/article/backing-up-your-recovery-passphrase-uacy9k/"
                }
              />
            );
          }
        });
      }, BACK_UP_ACCOUNTS_TIMEOUT);

      webStorage.local.removeItem(STORED_KEYS.CREATED_NEW_ACCOUNT);
    }

    return () => {
      clearInterval(timeout);
    };
  });

  if (!hasAccounts) return <Navigate to={ROUTES.BASE} replace={true} />;

  if (!portfolioOverview)
    return <PeraLoader mode={"gray"} customClassName={"pera-loader--align-center"} />;

  const {
    accounts: portfolioOverviewAccounts,
    portfolio_value_usd,
    portfolio_value_algo
  } = portfolioOverview;

  const portfolioAccounts = portfolioOverviewAccounts.filter(
    (account) => account.address in accounts
  );

  return (
    <>
      <div className={"account-overview"}>
        <AccountOverviewPortfolioValue
          portfolioValueUSD={portfolio_value_usd}
          portfolioValueALGO={portfolio_value_algo}
        />

        <div className={"account-overview__accounts-heading"}>
          <h2 className={"typography--subhead text-color--main"}>{"Accounts"}</h2>
          <span
            className={
              "typography--subhead text-color--gray-light account-overview__account-number"
            }>
            {accountCount}
          </span>
        </div>

        <AccountOverviewList accounts={portfolioAccounts} />

        <AccountOnboardingOptionList
          customClassName={"account-overview__onboarding-option-list"}
        />
      </div>

      <Outlet />
    </>
  );
}

export default AccountOverview;
