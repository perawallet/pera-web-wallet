import {ReactComponent as ChevronRightIcon} from "../../../../core/ui/icons/chevron-right.svg";
import {ReactComponent as WarningIcon} from "../../../../core/ui/icons/warning.svg";

import "./_asset-optin-account-link.scss";

import {Link} from "react-router-dom";

import {getAccountIcon, trimAccountName} from "../../../../account/util/accountUtils";
import ROUTES from "../../../../core/route/routes";
import {defaultPriceFormatter} from "../../../../core/util/number/numberUtils";
import {ALGO_UNIT} from "../../../../core/ui/typography/typographyConstants";
import {usePortfolioContext} from "../../../../overview/context/PortfolioOverviewContext";
import {useAppContext} from "../../../../core/app/AppContext";
import SimpleLoader from "../../../../component/loader/simple/SimpleLoader";

interface AssetOptinAccountLinkProps {
  account: AppDBAccount;
}

const TRIM_ACCOUNT_NAME_LENGTH = 18;

function AssetOptinAccountLink({account}: AssetOptinAccountLinkProps) {
  const {
    state: {accounts}
  } = useAppContext();
  const {algoFormatter} = defaultPriceFormatter();
  const portfolioOverview = usePortfolioContext();
  const accountPortfolio = portfolioOverview?.accounts.find(
    (portfolioAccount) => portfolioAccount.address === account.address
  );
  const accountPortfolioBalance = accountPortfolio
    ? parseFloat(accountPortfolio.total_algo_value)
    : 0;

  return (
    <Link to={ROUTES.ASSET_OPTIN.ACCOUNTS.ROUTE} className={"asset-optin-account-link"}>
      <div className={"asset-optin-account-link__name"}>
        {getAccountIcon({
          type: accounts[account.address].type,
          width: 32,
          height: 32
        })}

        <div>
          <p className={"typography--secondary-body text-color--gray-light"}>
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
    </Link>
  );

  function renderAccountBalance() {
    let node;

    if (!accountPortfolio) return <SimpleLoader />;

    if (accountPortfolioBalance > 0) {
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
            {`${ALGO_UNIT}0.00`}
          </p>
        </div>
      );
    }

    return node;
  }
}

export default AssetOptinAccountLink;
