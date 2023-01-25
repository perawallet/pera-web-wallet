import "./_transaction-sign-transaction-actions.scss";

import classNames from "classnames";

import Button from "../../../../../component/button/Button";
import {useTransactionSignFlowContext} from "../../../../context/TransactionSignFlowContext";
import {checkIfSignRequiredForTransactions} from "../../../../utils/transactionUtils";

interface TransactionSignTransactionActionsProps {
  handleSignClick: VoidFunction;
  handleSignCancel: VoidFunction;
}

function TransactionSignTransactionActions({
  handleSignClick,
  handleSignCancel
}: TransactionSignTransactionActionsProps) {
  const {
    formitoState: {isSignStarted, txns, currentSession}
  } = useTransactionSignFlowContext();
  const signIsRequired = checkIfSignRequiredForTransactions(txns, currentSession!);

  return (
    <div
      className={classNames("transaction-sign-transaction-actions", {
        "transaction-sign-transaction-actions--sign-required": signIsRequired
      })}>
      <Button
        isDisabled={!txns}
        onClick={handleSignCancel}
        customClassName={"transaction-sign-transaction-actions__button"}
        buttonType={"light"}>
        {signIsRequired ? "Cancel" : "Close"}
      </Button>

      {signIsRequired && (
        <Button
          isDisabled={!txns}
          onClick={handleSignClick}
          shouldDisplaySpinner={isSignStarted}
          customClassName={"transaction-sign-transaction-actions__button"}
          buttonType={"primary"}>
          {txns.length > 1 ? "Confirm All" : "Confirm"}
        </Button>
      )}
    </div>
  );
}

export default TransactionSignTransactionActions;
