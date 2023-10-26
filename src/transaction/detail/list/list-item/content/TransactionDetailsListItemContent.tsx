import {ReactComponent as ChevronRight} from "../../../../../core/ui/icons/chevron-right.svg";
import {ReactComponent as WarningIcon} from "../../../../../core/ui/icons/warning.svg";

import "./_transaction-details-list-item-content.scss";

import {Transaction} from "algosdk";

import {useTransactionSignFlowContext} from "../../../../context/TransactionSignFlowContext";
import {
  getTransactionTypeText,
  isTxnArbitraryData,
  transactionHasClearState,
  transactionHasCloseRemainder,
  transactionHasRekey
} from "../../../../utils/transactionUtils";
import TransactionDetailListItemTitle from "../title/TransactionDetailsListItemTitle";
import {ArbitraryData} from "../../../../../core/util/model/peraWalletModel";

interface TransactionDetailsListItemContentProps {
  transaction: Transaction | ArbitraryData;
  transactionIndex: number;
}

function TransactionDetailsListItemContent({
  transaction,
  transactionIndex
}: TransactionDetailsListItemContentProps) {
  const isArbitraryData = isTxnArbitraryData(transaction);
  const {
    formitoState: {txns, userAddress, currentSession, arbitraryData}
  } = useTransactionSignFlowContext();
  const totalWarningCount = getTotalWarningCount();

  return (
    <div
      className={
        "has-space-between align-center--vertically transaction-details-list-item-content"
      }>
      <div>
        {isArbitraryData ? (
          `Data sign${currentSession?.title ? ` from ${currentSession?.title}` : ""}`
        ) : (
          <TransactionDetailListItemTitle transaction={transaction} />
        )}

        <div
          className={
            "text-color--gray typography--secondary-body transaction-details-list-item-content__footer"
          }>
          {isArbitraryData
            ? "Data Sign"
            : getTransactionTypeText(transaction, userAddress)}

          <span className={"bullet"} />

          {`${transactionIndex + 1} of ${arbitraryData?.data.length || txns.length}`}

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
    if (isArbitraryData) return 0;

    let total = 0;

    if (transactionHasRekey(transaction, userAddress)) {
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
