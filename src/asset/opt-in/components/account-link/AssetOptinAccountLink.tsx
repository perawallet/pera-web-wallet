import {ReactComponent as ChevronRightIcon} from "../../../../core/ui/icons/chevron-right.svg";
import {ReactComponent as WarningIcon} from "../../../../core/ui/icons/warning.svg";

import "./_asset-optin-account-link.scss";

import {Link} from "react-router-dom";
import {algosToMicroalgos, microalgosToAlgos} from "algosdk";

import {trimAccountName} from "../../../../account/util/accountUtils";
import ROUTES from "../../../../core/route/routes";
import {defaultPriceFormatter} from "../../../../core/util/number/numberUtils";
import {ALGO_UNIT} from "../../../../core/ui/typography/typographyConstants";
import {usePortfolioContext} from "../../../../overview/context/PortfolioOverviewContext";
import SimpleLoader from "../../../../component/loader/simple/SimpleLoader";
import useAccountIcon from "../../../../core/util/hook/useAccountIcon";

const TRIM_ACCOUNT_NAME_LENGTH = 18;

// eslint-disable-next-line no-magic-numbers
const MIN_OPT_IN_TXN_COST = algosToMicroalgos(0.2);

function AssetOptinAccountLink({address}: {address: string}) {
  const {accounts} = usePortfolioContext()!;
  const account = accounts[address];
  const {algoFormatter} = defaultPriceFormatter();
  const {renderAccountIcon} = useAccountIcon();

  return (
    <Link to={ROUTES.ASSET_OPTIN.ACCOUNTS.ROUTE} className={"asset-optin-account-link"}>
      <div className={"asset-optin-account-link__content"}>
        <div className={"asset-optin-account-link__name"}>
          {renderAccountIcon({account})}

          <div>
            <p className={"typography--secondary-body text-color--gray-lighter"}>
              {"Selected account"}
            </p>

            <p className={"typography--body text-color--main"}>
              {trimAccountName(account.name, TRIM_ACCOUNT_NAME_LENGTH)}
            </p>
          </div>
        </div>

        <div className={"asset-optin-account-link__balance"}>
          {renderAccountBalance()}

          <ChevronRightIcon />
        </div>
      </div>
    </Link>
  );

  function renderAccountBalance() {
    let node;

    if (!account) return <SimpleLoader />;

    const accountPortfolioBalance = account ? parseFloat(account.total_algo_value) : 0;

    if (
      account.minimum_balance &&
      accountPortfolioBalance >= account.minimum_balance &&
      accountPortfolioBalance > MIN_OPT_IN_TXN_COST
    ) {
      node = (
        <p
          className={
            "typography--bold-body text-color--main"
          }>{`${ALGO_UNIT}${algoFormatter(accountPortfolioBalance, {
          maximumFractionDigits: 2
        })}`}</p>
      );
    } else {
      node = (
        <div>
          <p
            className={
              "typography--secondary-body asset-optin-account-link__balance-warning"
            }>
            <WarningIcon width={16} />
            {"Balance too low"}
          </p>
          <p className={"typography--bold-body text-color--main text--right"}>
            {`${ALGO_UNIT}${microalgosToAlgos(accountPortfolioBalance)}`}
          </p>
        </div>
      );
    }

    return node;
  }
}

export default AssetOptinAccountLink;
