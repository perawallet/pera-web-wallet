import "./_transaction-sign-default-view.scss";

import TransactionSignReviewTransactions from "./review-txns/TransactionSignReviewTransactions";
import TransactionSignAppMeta from "./app-meta/TransactionSignAppMeta";
import TransactionSignTransactionActions from "./actions/TransactionSignTransactionActions";

interface TransactionSignDefaultViewProps {
  handleSignClick: VoidFunction;
  handleSignCancel: VoidFunction;
}

function TransactionSignDefaultView({
  handleSignClick,
  handleSignCancel
}: TransactionSignDefaultViewProps) {
  return (
    <>
      <TransactionSignAppMeta />

      <TransactionSignReviewTransactions />

      <TransactionSignTransactionActions
        handleSignClick={handleSignClick}
        handleSignCancel={handleSignCancel}
      />
    </>
  );
}

export default TransactionSignDefaultView;
