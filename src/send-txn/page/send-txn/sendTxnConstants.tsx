import {ReactComponent as InfoIcon} from "../../../core/ui/icons/info.svg";
import {ReactComponent as TipIcon} from "../../../core/ui/icons/tip.svg";

export const SEND_TXN_INFO_MODAL_ID = "send-txn-info-modal";

export const SEND_TXN_INFO_MODAL_TIPS = [
  {
    id: "header",
    icon: <TipIcon className={"send-txn__info-tip-icon"} width={20} height={20} />,
    description: "Before you proceed",
    type: "header"
  },
  {
    id: "send-txn-warning-amount",
    icon: <InfoIcon className={"send-txn__info-tip-icon"} width={20} height={20} />,
    description:
      "When sending to an address for the first time, send a small test transaction to verify the address before sending the full amount."
  },
  {
    id: "send-txn-warning-address",
    icon: <InfoIcon className={"send-txn__info-tip-icon"} width={20} height={20} />,
    description: (
      <div>
        {
          "Exchanges change their deposit addresses frequently, and saved exchange addresses may no longer be in use. "
        }

        <span className={"send-txn__info-warning"}>
          {"Ensure you're sending to the correct address."}
        </span>
      </div>
    )
  }
];
