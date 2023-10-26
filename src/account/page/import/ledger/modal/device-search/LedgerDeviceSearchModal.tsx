import "./_ledger-device-search-modal.scss";

import {ReactComponent as TipIcon} from "../../../../../../core/ui/icons/tip.svg";
import {ReactComponent as InfoIcon} from "../../../../../../core/ui/icons/info.svg";
import {ReactComponent as LedgerSearchIcon} from "../../../../../../core/ui/icons/ledger-search.svg";

import InfoModal from "../../../../../../component/info-modal/InfoModal";

export const LEDGER_DEVICE_SEARCH_MODAL_ID = "ledger-device-search-modal";

const LEDGER_DEVICE_SEARCH_MODAL_INFO_ITEMS = [
  {
    id: "header",
    icon: <TipIcon width={20} height={20} />,
    description: "Don't see your Ledger?"
  },
  {
    id: "device-unlock",
    icon: <InfoIcon width={20} height={20} />,
    description: "Make sure the device is unlocked"
  },
  {
    id: "algorand-app",
    icon: <InfoIcon width={20} height={20} />,
    description: "Open the Algorand App on Ledger"
  }
];

function LedgerDeviceSearchModal() {
  return (
    <InfoModal
      customClassName={"ledger-device-search-modal"}
      iconHeader={<LedgerSearchIcon />}
      modalId={LEDGER_DEVICE_SEARCH_MODAL_ID}
      infoItems={LEDGER_DEVICE_SEARCH_MODAL_INFO_ITEMS}
      title={"Searching for devices.."}
    />
  );
}

export default LedgerDeviceSearchModal;
