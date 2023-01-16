import {ReactComponent as AlgoASAIcon} from "../../../../../../core/ui/icons/algo-asa.svg";
import {ReactComponent as WarningIcon} from "../../../../../../core/ui/icons/warning.svg";
import {ReactComponent as InfoIcon} from "../../../../../../core/ui/icons/info.svg";

import "./_transaction-sign-assets-list.scss";

import {List} from "@hipo/react-ui-toolkit";
import {microalgosToAlgos, Transaction} from "algosdk";
import classNames from "classnames";

import TransactionSignAssetsListItem from "./item/TransactionSignAssetsListItem";
import {ALGO_UNIT} from "../../../../../../core/ui/typography/typographyConstants";
import {formatNumber} from "../../../../../../core/util/number/numberUtils";
import {
  isAlgoTransferTransaction,
  isAllTransactionsEmpty,
  transactionHasCloseRemainder,
  transactionHasRekey
} from "../../../../../utils/transactionUtils";
import Tooltip from "../../../../../../component/tooltip/Tooltip";
import Button from "../../../../../../component/button/Button";
import {useTransactionSignFlowContext} from "../../../../../context/TransactionSignFlowContext";

interface TransactionSignAssetsListProps {
  transactions: Transaction[];
  title: string;
  type: "receive" | "spend" | "opt-in" | "app-call" | "asset-config" | "signed-by-others";
}

function TransactionSignAssetsList({
  transactions,
  title,
  type
}: TransactionSignAssetsListProps) {
  const {dispatchFormitoAction: dispatchTransactionPageAction} =
    useTransactionSignFlowContext();
  const algoTransactions = transactions.filter(isAlgoTransferTransaction);
  const totalAlgoValue = algoTransactions.reduce(
    (prevValue, transaction) => prevValue + Number(transaction.amount),
    0
  );
  const hasRekeyTransaction = algoTransactions.some(transactionHasRekey);
  const hasCloseReminderTransaction = algoTransactions.some(transactionHasCloseRemainder);

  return (
    <div className={"transaction-sign-assets-list"}>
      <div
        className={classNames(
          "typography--tagline text--uppercase text-color--gray-light transaction-sign-assets-list__subtitle",
          {
            "transaction-sign-assets-list__subtitle--with-tooltip":
              type === "signed-by-others"
          }
        )}>
        {title}

        {type === "signed-by-others" && (
          <Tooltip.Optional
            customClassName={"transaction-sign-assets-list__tooltip"}
            withinTooltip={true}
            dataFor={"transaction-sign-assets-list__subtitle__tooltip"}
            content={
              "This transaction is authorized by another party, for example using a logic signature."
            }>
            <InfoIcon width={16} height={16} />
          </Tooltip.Optional>
        )}
      </div>

      {!isAllTransactionsEmpty(transactions) && (
        <List items={transactions}>
          {(item) => (
            <TransactionSignAssetsListItem
              customClassName={classNames({
                "transaction-sign-assets-list-item--with-border-bottom":
                  totalAlgoValue > 0
              })}
              transaction={item}
            />
          )}
        </List>
      )}

      {(totalAlgoValue > 0 || isAllTransactionsEmpty(transactions)) && (
        <div className={"has-space-between align-center--vertically"}>
          <div className={"transaction-sign-assets-list__total-algo-value"}>
            <AlgoASAIcon width={40} height={40} />

            <div>
              <p className={"typography--medium-body"}>{`${
                type === "receive" ? "+" : "-"
              }${ALGO_UNIT}${formatNumber({
                minimumFractionDigits: 2
              })(
                microalgosToAlgos(
                  isAllTransactionsEmpty(transactions) ? 0 : totalAlgoValue
                )
              )}`}</p>

              <p className={"typography--secondary-body text-color--gray-light"}>
                {"ALGO"}
              </p>
            </div>
          </div>

          {(hasRekeyTransaction || hasCloseReminderTransaction) && (
            <Button buttonType={"custom"} onClick={handleChangeView}>
              <div className={"transaction-sign-assets-list__total-algo-value__warning"}>
                <WarningIcon width={20} height={20} />

                <span className={"typography--secondary-bold-body text-color--danger"}>
                  {"Warning"}
                </span>
              </div>
            </Button>
          )}
        </div>
      )}
    </div>
  );

  function handleChangeView() {
    dispatchTransactionPageAction({
      type: "SET_FORM_VALUE",
      payload: {
        activeTransactionIndex: 0,
        transactionSignView: "txn-detail-single"
      }
    });
  }
}

export default TransactionSignAssetsList;
