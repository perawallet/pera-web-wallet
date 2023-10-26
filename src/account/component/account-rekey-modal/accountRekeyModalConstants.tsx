import {ReactComponent as InfoIcon} from "../../../core/ui/icons/info.svg";
import {ReactComponent as TipIcon} from "../../../core/ui/icons/tip.svg";

export const ACCOUNT_REKEY_MODAL_ID = "account-rekey-modal";
export const ACCOUNT_REKEY_INFO_MODAL_ID = "account-rekey-info-modal";

export const ACCOUNT_REKEY_INFO_MODAL_TIPS = [
  {
    id: "header",
    icon: <TipIcon className={"account-rekey__info-tip-icon"} width={20} height={20} />,
    description: "What to expect",
    type: "header"
  },
  {
    id: "account-rekey-warning-amount",
    icon: <InfoIcon className={"account-rekey__info-tip-icon"} width={20} height={20} />,
    description: "Future transactions can only be signed by the delegated account."
  },
  {
    id: "account-rekey-warning-address",
    icon: <InfoIcon className={"account-rekey__info-tip-icon"} width={20} height={20} />,
    description: "This account will no longer be able to sign transactions."
  },
  {
    id: "account-rekey-warning-address",
    icon: <InfoIcon className={"account-rekey__info-tip-icon"} width={20} height={20} />,
    description: "Your account’s public key, balances, and configuration will not change."
  }
];
