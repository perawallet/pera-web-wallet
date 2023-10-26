import {ReactComponent as WarningIcon} from "../../../core/ui/icons/warning.svg";
import {ReactComponent as InfoIcon} from "../../../core/ui/icons/info.svg";

const TRANSFER_MOBILE_INFO_MODAL_ID = "transfer-mobile-info-modal";

const TRANSFER_MOBILE_INFO_MODAL_TIPS = [
  {
    id: "sensitive-data-warning",
    icon: <WarningIcon width={20} height={20} />,
    description: "You are about to reveal sensitive data"
  },
  {
    id: "qr-generation-info",
    icon: <InfoIcon width={20} height={20} />,
    description:
      "You are about to generate a QR code which contains the private keys of your Algorand accounts."
  },
  {
    id: "qr-access-info",
    icon: <InfoIcon width={20} height={20} />,
    description: "Anyone who scans this QR code can gain full access to your accounts."
  },
  {
    id: "qr-scan-info",
    icon: <InfoIcon width={20} height={20} />,
    description: "This QR should only be scanned by you on your own Pera Mobile device."
  }
];

export {TRANSFER_MOBILE_INFO_MODAL_ID, TRANSFER_MOBILE_INFO_MODAL_TIPS};
