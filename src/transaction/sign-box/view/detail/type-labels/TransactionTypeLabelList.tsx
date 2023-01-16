import {List, ListItem} from "@hipo/react-ui-toolkit";

import "./_transaction-type-label-list.scss";

import {useTransactionSignFlowContext} from "../../../../context/TransactionSignFlowContext";
import {getTransactionTypeCountTexts} from "../../../../utils/transactionUtils";

function TransactionTypeLabelList() {
  const {
    formitoState: {userAddress, txns}
  } = useTransactionSignFlowContext();
  const transactions = txns.map((txn) => txn.txn);
  const transactionTypeNumberTexts = getTransactionTypeCountTexts(
    transactions,
    userAddress
  );

  return (
    <List
      customClassName={"transaction-sign-label-list"}
      items={transactionTypeNumberTexts}>
      {(item) => (
        <ListItem
          customClassName={"typography--caption transaction-sign-label-list__item"}>
          {item}
        </ListItem>
      )}
    </List>
  );
}

export default TransactionTypeLabelList;
