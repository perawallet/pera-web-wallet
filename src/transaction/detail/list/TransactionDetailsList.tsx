import "./_transaction-details-list.scss";

import {List} from "@hipo/react-ui-toolkit";

import TransactionDetailsListItem from "./list-item/TransactionDetailsListItem";
import {useTransactionSignFlowContext} from "../../context/TransactionSignFlowContext";

function TransactionDetailsList() {
  const {
    formitoState: {txns}
  } = useTransactionSignFlowContext();

  return (
    <List customClassName={"transaction-details-list"} items={txns}>
      {(transaction, _, index) => (
        <TransactionDetailsListItem
          transaction={transaction.txn}
          transactionIndex={index!}
        />
      )}
    </List>
  );
}

export default TransactionDetailsList;
