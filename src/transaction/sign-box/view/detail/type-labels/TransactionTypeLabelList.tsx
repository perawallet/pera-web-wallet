import {List, ListItem} from "@hipo/react-ui-toolkit";

import "./_transaction-type-label-list.scss";

import {useTransactionSignFlowContext} from "../../../../context/TransactionSignFlowContext";
import {getTransactionTypeCountTexts} from "../../../../utils/transactionUtils";

function TransactionTypeLabelList() {
  const {
    formitoState: {userAddress, txns, arbitraryData}
  } = useTransactionSignFlowContext();
  const transactions = txns.map((txn) => txn.txn);
  const transactionTypeNumberTexts = getTransactionTypeCountTexts(
    transactions,
    userAddress
  );

  if (arbitraryData) {
    return (
      <div className={"transaction-sign-label-list"}>
        <span className={"typography--caption transaction-sign-label-list__item"}>
          {`${arbitraryData?.data.length}x Data Sign`}
        </span>
      </div>
    );
  }

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
