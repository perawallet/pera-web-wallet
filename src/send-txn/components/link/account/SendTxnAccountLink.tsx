import {ReactComponent as AccountDefaultIcon} from "../../../../core/ui/icons/account-default.svg";

import {useAppContext} from "../../../../core/app/AppContext";
import ROUTES from "../../../../core/route/routes";
import {ALGO_UNIT} from "../../../../core/ui/typography/typographyConstants";
import {useSendTxnFlowContext} from "../../../context/SendTxnFlowContext";
import SendTxnLink from "../SendTxnLink";
import {defaultPriceFormatter} from "../../../../core/util/number/numberUtils";
import FormatUSDBalance from "../../../../component/format-balance/usd/FormatUSDBalance";
import {usePortfolioContext} from "../../../../overview/context/PortfolioOverviewContext";

function SendTxnAccountLink() {
  const {
    state: {accounts}
  } = useAppContext();
  const {
    formitoState: {senderAddress}
  } = useSendTxnFlowContext();
  const portfolioOverview = usePortfolioContext();
  const {algoFormatter} = defaultPriceFormatter();
  const selectedAccountDetails = portfolioOverview!.accounts.find(
    (account) => account.address === senderAddress
  );

  return (
    <SendTxnLink
      to={ROUTES.SEND_TXN.ACCOUNTS.ROUTE}
      content={{
        label: "Accounts",
        name: senderAddress ? accounts[senderAddress].name : "",
        icon: <AccountDefaultIcon width={20} height={20} />,
        placeholder: "Not Selected"
      }}
      options={{
        description: selectedAccountDetails && (
          <div className={"text--right"}>
            <FormatUSDBalance
              value={selectedAccountDetails.total_usd_value}
              customClassName={"typography--caption text-color--gray-light"}
            />

            <p>
              {ALGO_UNIT}
              {algoFormatter(Number(selectedAccountDetails.total_algo_value))}
            </p>
          </div>
        ),
        placeholder: "Select account"
      }}
    />
  );
}

export default SendTxnAccountLink;
