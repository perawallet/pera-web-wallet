import {ReactComponent as ChevronRight} from "../../../../../core/ui/icons/chevron-right.svg";
import {ReactComponent as WarningIcon} from "../../../../../core/ui/icons/warning.svg";

import "./_transaction-details-list-item-content.scss";

import {Transaction} from "algosdk";

import {useTransactionSignFlowContext} from "../../../../context/TransactionSignFlowContext";
import {
  getTransactionTypeText,
  transactionHasClearState,
  transactionHasCloseRemainder,
  transactionHasRekey
} from "../../../../utils/transactionUtils";
import TransactionDetailListItemTitle from "../title/TransactionDetailsListItemTitle";

interface TransactionDetailsListItemContentProps {
  transaction: Transaction;
  transactionIndex: number;
}

function TransactionDetailsListItemContent({
  transaction,
  transactionIndex
}: TransactionDetailsListItemContentProps) {
  const {
    formitoState: {txns, userAddress}
  } = useTransactionSignFlowContext();
  const totalWarningCount = getTotalWarningCount();

  return (
    <div
      className={
        "has-space-between align-center--vertically transaction-details-list-item-content"
      }>
      <div>
        <TransactionDetailListItemTitle transaction={transaction} />

        <div
          className={
            "text-color--gray typography--secondary-body transaction-details-list-item-content__footer"
          }>
          {getTransactionTypeText(transaction, userAddress)}

          <span className={"bullet"} />

          {`${transactionIndex + 1} of ${txns.length}`}

          {totalWarningCount > 0 && (
            <>
              <span className={"bullet"} />

              <div className={"transaction-details-list-item-content__warning"}>
                <WarningIcon width={20} height={20} />

                <span className={"typography--secondary-bold-body text-color--danger"}>
                  {`${totalWarningCount} Warning`}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <ChevronRight width={20} height={20} />
    </div>
  );

  function getTotalWarningCount() {
    let total = 0;

    if (transactionHasRekey(transaction)) {
      total += 1;
    }

    if (transactionHasCloseRemainder(transaction)) {
      total += 1;
    }

    if (transactionHasClearState(transaction)) {
      total += 1;
    }

    return total;
  }
}

export default TransactionDetailsListItemContent;
