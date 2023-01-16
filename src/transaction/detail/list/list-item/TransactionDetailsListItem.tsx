import "./_transaction-details-list-item.scss";

import {ListItem} from "@hipo/react-ui-toolkit";
import {Transaction} from "algosdk";

import {useTransactionSignFlowContext} from "../../../context/TransactionSignFlowContext";
import TransactionDetailsListItemContent from "./content/TransactionDetailsListItemContent";

interface TransactionDetailsListItemProps {
  transaction: Transaction;
  transactionIndex: number;
}

function TransactionDetailsListItem({
  transaction,
  transactionIndex
}: TransactionDetailsListItemProps) {
  const {dispatchFormitoAction: dispatchTransactionPageAction} =
    useTransactionSignFlowContext();

  return (
    <ListItem
      customClassName={"transaction-details-list-item"}
      clickableListItemProps={{onClick: handleTransactionDetailsListItemClick}}>
      <TransactionDetailsListItemContent
        transaction={transaction}
        transactionIndex={transactionIndex}
      />
    </ListItem>
  );

  function handleTransactionDetailsListItemClick() {
    dispatchTransactionPageAction({
      type: "SET_FORM_VALUE",
      payload: {
        activeTransactionIndex: transactionIndex,
        transactionSignView: "txn-detail-single"
      }
    });
  }
}

export default TransactionDetailsListItem;
