import "./_account-overview.scss";

import {useEffect} from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useToaster} from "@hipo/react-ui-toolkit";

import {useAppContext} from "../../../core/app/AppContext";
import ROUTES from "../../../core/route/routes";
import AccountOverviewList from "./list/AccountOverviewList";
import AccountOverviewPortfolioValue from "./portfolio-value/AccountOverviewPortfolioValue";
import {usePortfolioContext} from "../../context/PortfolioOverviewContext";
import AccountImportOnboardingOptionList from "../../../account/component/onboarding-option-list/AccountImportOnboardingOptionList";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import PeraToast from "../../../component/pera-toast/PeraToast";
import {SECOND_IN_MS} from "../../../core/util/time/timeConstants";
import webStorage, {STORED_KEYS} from "../../../core/util/storage/web/webStorage";
import {trimAccountName} from "../../../account/util/accountUtils";
import useSetPageTitle from "../../../core/util/hook/useSetPageTitle";
import Banner from "../../../component/banner/Banner";
import useAsyncProcess from "../../../core/network/async-process/useAsyncProcess";
import {BannerResponse} from "../../../core/util/pera/api/peraApiModels";
import {peraApi} from "../../../core/util/pera/api/peraApi";
import PeraLoader from "../../../component/loader/pera/PeraLoader";
import AccountLimitWarningBanner from "../../../account/component/account-limit-warning-banner/AccountLimitWarningBanner";

const BACK_UP_ACCOUNTS_TIMEOUT = SECOND_IN_MS;

function AccountOverview() {
  const {
    state: {hasAccounts, deviceId}
  } = useAppContext();
  const portfolioOverview = usePortfolioContext() || {};
  const accountCount = Object.keys(portfolioOverview.accounts || {}).length;
  const simpleToaster = useSimpleToaster();
  const toaster = useToaster();
  const {
    runAsyncProcess,
    state: {data: bannerListResponse}
  } = useAsyncProcess<BannerResponse>();
  const [banner] = bannerListResponse?.results || [];

  useSetPageTitle("Accounts");

  useEffect(() => {
    const createdNewAccount = webStorage.local.getItem(STORED_KEYS.CREATED_NEW_ACCOUNT);
    const importedNewAccounts = webStorage.local.getItem(
      STORED_KEYS.IMPORTED_NEW_ACCOUNTS
    );
    let timeout: NodeJS.Timeout;
    let toastMessage: string | undefined;

    if (createdNewAccount || importedNewAccounts) {
      toastMessage = createdNewAccount
        ? `New account "${trimAccountName(String(createdNewAccount))}" added`
        : "New accounts added";
    }

    if (toastMessage) {
      simpleToaster.display({
        id: "backup-account-success-toast",
        message: toastMessage,
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
      webStorage.local.removeItem(STORED_KEYS.IMPORTED_NEW_ACCOUNTS);
    }

    return () => {
      clearInterval(timeout);
    };
  });

  useEffect(() => {
    const abortController = new AbortController();

    if (deviceId) {
      runAsyncProcess(peraApi.getBanners(deviceId, {signal: abortController.signal}));
    }

    return () => abortController.abort();
  }, [runAsyncProcess, deviceId]);

  if (!hasAccounts) return <Navigate to={ROUTES.BASE} replace={true} />;

  // portfolio overview request is pending
  if (accountCount < 1)
    return <PeraLoader mode={"gray"} customClassName={"pera-loader--align-center"} />;

  return (
    <>
      <div className={"account-overview"}>
        <AccountOverviewPortfolioValue />

        {banner && <Banner banner={banner} />}

        <div className={"account-overview__accounts-heading"}>
          <h2 className={"typography--subhead text-color--main"}>{"Accounts"}</h2>
        </div>

        <AccountLimitWarningBanner accountCount={accountCount} />

        <AccountOverviewList />

        <div className={"account-overview__onboarding"}>
          <h1 className={"typography--small-subhead"}>{"Quick access"}</h1>

          <AccountImportOnboardingOptionList
            customClassName={"account-overview__onboarding-option-list"}
          />
        </div>
      </div>

      <Outlet />
    </>
  );
}

export default AccountOverview;
