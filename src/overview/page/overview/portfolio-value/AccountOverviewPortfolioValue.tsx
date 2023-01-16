import {ReactComponent as PlusIcon} from "../../../../core/ui/icons/plus.svg";
import {ReactComponent as AlgoIcon} from "../../../../core/ui/icons/algo.svg";
import {ReactComponent as AddFundsIcon} from "../../../../core/ui/icons/add-funds.svg";

import "./_account-overview-portfolio-value.scss";

import {memo} from "react";

import {defaultPriceFormatter} from "../../../../core/util/number/numberUtils";
import FormatUSDBalance from "../../../../component/format-balance/usd/FormatUSDBalance";
import LinkButton from "../../../../component/button/LinkButton";
import ROUTES from "../../../../core/route/routes";
import Button from "../../../../component/button/Button";
import {useModalDispatchContext} from "../../../../component/modal/context/ModalContext";
import AccountOverviewAddFundsModal, {
  ACCOUNT_OVERVIEW_ADD_FUNDS_MODAL_ID
} from "../add-funds/AccountOverviewAddFundsModal";
import {usePortfolioContext} from "../../../context/PortfolioOverviewContext";

interface AccountOverviewPortfolioValueProps {
  portfolioValueALGO: string;
  portfolioValueUSD: string;
}

function AccountOverviewPortfolioValue({
  portfolioValueALGO,
  portfolioValueUSD
}: AccountOverviewPortfolioValueProps) {
  const [algoValue, usdValue] = [portfolioValueALGO, portfolioValueUSD].map(Number);
  const {algoFormatter} = defaultPriceFormatter();
  const dispatchModalStateAction = useModalDispatchContext();
  const portfolioOverview = usePortfolioContext();

  return (
    <div className={"account-overview-portfolio-value"}>
      <h2 className={"typography--subhead text-color--main"}>{"Portfolio Value"}</h2>

      <div className={"account-overview-portfolio-value__body-container"}>
        <div className={"account-overview-portfolio-value__body"}>
          <div
            className={"account-overview-portfolio-value__algo align-center--vertically"}>
            <span className={"account-overview-portfolio-value__algo__icon"}>
              <AlgoIcon width={16} height={16} />
            </span>

            <p
              className={
                "typography--display account-overview-portfolio-value__algo__value"
              }>
              {algoFormatter(algoValue, {
                maximumFractionDigits: 2
              })}
            </p>
          </div>

          <div className={"account-overview-portfolio-value__body-cta-group"}>
            <Button
              buttonType={"secondary"}
              size={"large"}
              onClick={handleAddFundsClick}
              customClassName={"account-overview-portfolio-value__add-funds"}>
              <AddFundsIcon />

              {"Add Funds"}
            </Button>

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

        <FormatUSDBalance
          value={usdValue}
          customClassName={
            "typography--body text-color--gray account-overview-portfolio-value__usd"
          }
          prefix={"≈"}
        />
      </div>
    </div>
  );

  function handleAddFundsClick() {
    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: ACCOUNT_OVERVIEW_ADD_FUNDS_MODAL_ID,
          modalContentLabel: "Select an Account to Opt-in",
          customClassName: "account-overview-portfolio-value__add-funds-modal",
          children: (
            <AccountOverviewAddFundsModal accounts={portfolioOverview!.accounts} />
          )
        }
      }
    });
  }
}

export default memo(AccountOverviewPortfolioValue);
