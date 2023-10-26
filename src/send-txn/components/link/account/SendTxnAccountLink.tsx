import {ReactComponent as WarningIcon} from "../../../../core/ui/icons/warning.svg";

import "./_send-txn-account-link.scss";

import {microalgosToAlgos} from "algosdk";

import ROUTES from "../../../../core/route/routes";
import {ALGO_UNIT} from "../../../../core/ui/typography/typographyConstants";
import {useSendTxnFlowContext} from "../../../context/SendTxnFlowContext";
import SendTxnLink from "../SendTxnLink";
import {defaultPriceFormatter} from "../../../../core/util/number/numberUtils";
import FormatUSDBalance from "../../../../component/format-balance/usd/FormatUSDBalance";
import {usePortfolioContext} from "../../../../overview/context/PortfolioOverviewContext";
import useAccountIcon from "../../../../core/util/hook/useAccountIcon";
import Tooltip from "../../../../component/tooltip/Tooltip";

function SendTxnAccountLink() {
  const {accounts = {}} = usePortfolioContext() || {};
  const {
    formitoState: {senderAddress}
  } = useSendTxnFlowContext();
  const selectedAccountDetails = accounts[senderAddress!];
  const {algoFormatter} = defaultPriceFormatter();
  const {renderAccountIcon} = useAccountIcon();
  const {minimum_balance, total_algo_value} = selectedAccountDetails;

  return (
    <SendTxnLink
      customClassName={"send-txn-account-link"}
      to={ROUTES.SEND_TXN.ACCOUNTS.ROUTE}
      content={{
        label: "Accounts",
        name: senderAddress ? accounts[senderAddress].name : "",
        icon: selectedAccountDetails
          ? renderAccountIcon({account: selectedAccountDetails, size: 20})
          : null,
        placeholder: "Not Selected",
        tooltip: minimum_balance && minimum_balance > Number(total_algo_value) && (
          <Tooltip
            content={`Minimum balance required (${microalgosToAlgos(
              minimum_balance
            )} ALGO)`}
            dataFor={"send-txn-account-link-min-balance-warning"}>
            <WarningIcon width={16} height={16} />
          </Tooltip>
        )
      }}
      options={{
        description: selectedAccountDetails && (
          <div className={"text--right"}>
            <FormatUSDBalance
              value={selectedAccountDetails.total_usd_value}
              customClassName={"typography--caption text-color--gray-lighter"}
            />

            <p>
              {ALGO_UNIT}
              {algoFormatter(Number(total_algo_value))}
            </p>
          </div>
        ),
        placeholder: "Select account"
      }}
    />
  );
}

export default SendTxnAccountLink;
