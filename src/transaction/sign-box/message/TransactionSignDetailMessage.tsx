import {ReactComponent as WarningIcon} from "../../../core/ui/icons/warning.svg";
import {ReactComponent as InfoIcon} from "../../../core/ui/icons/info.svg";

import "./_transaction-sign-detail-message.scss";

interface TransactionSignDetailMessageProps {
  message: string;
  type: "warning" | "info";
}

function TransactionSignDetailMessage({
  message,
  type
}: TransactionSignDetailMessageProps) {
  return (
    <div
      className={`typography--caption transaction-sign-detail-message transaction-sign-detail-message--${type}`}>
      {type === "warning" ? (
        <WarningIcon width={24} height={24} />
      ) : (
        <InfoIcon width={24} height={24} />
      )}

      <p>{message}</p>
    </div>
  );
}

export default TransactionSignDetailMessage;
