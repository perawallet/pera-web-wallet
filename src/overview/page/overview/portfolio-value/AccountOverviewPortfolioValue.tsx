import {ReactComponent as PlusIcon} from "../../../../core/ui/icons/plus.svg";

import "./_account-overview-portfolio-value.scss";

import {memo} from "react";

import {defaultPriceFormatter} from "../../../../core/util/number/numberUtils";
import FormatUSDBalance from "../../../../component/format-balance/usd/FormatUSDBalance";
import LinkButton from "../../../../component/button/LinkButton";
import ROUTES from "../../../../core/route/routes";
import AddFundsButton from "../../../../add-funds/button/AddFundsButton";
import {ALGO_UNIT} from "../../../../core/ui/typography/typographyConstants";
import {usePortfolioContext} from "../../../context/PortfolioOverviewContext";

function AccountOverviewPortfolioValue() {
  const {
    overview: {
      portfolio_value_usd: portfolioValueUSD,
      portfolio_value_algo: portfolioValueALGO
    }
  } = usePortfolioContext()!;
  const [algoValue, usdValue] = [portfolioValueALGO, portfolioValueUSD].map(Number);
  const {algoFormatter} = defaultPriceFormatter();

  return (
    <div className={"account-overview-portfolio-value"}>
      <h2 className={"typography--subhead text-color--main"}>{"Portfolio Value"}</h2>

      <div className={"account-overview-portfolio-value__body-container"}>
        <div className={"account-overview-portfolio-value__body"}>
          <div
            className={"account-overview-portfolio-value__algo align-center--vertically"}>
            <div>
              <p
                className={
                  "typography--display account-overview-portfolio-value__algo__value"
                }>
                <span
                  className={
                    "account-overview-portfolio-value__algo__value__algo-unit"
                  }>{`${ALGO_UNIT} `}</span>

                {`${algoFormatter(algoValue, {
                  maximumFractionDigits: 2
                })}`}
              </p>

              <FormatUSDBalance
                value={usdValue}
                customClassName={
                  "typography--body text-color--gray account-overview-portfolio-value__usd"
                }
                prefix={"≈"}
              />
            </div>
          </div>

          <div className={"account-overview-portfolio-value__body-cta-group"}>
            <AddFundsButton buttonType={"secondary"} size={"large"} />

            <LinkButton
              customClassName={"account-overview-portfolio-value__add-account"}
              buttonType={"primary"}
              size={"large"}
              to={ROUTES.ACCOUNT.ROUTE}>
              <PlusIcon width={16} height={16} />

              {"Add Account"}
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AccountOverviewPortfolioValue);
