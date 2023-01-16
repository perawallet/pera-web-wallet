import {ReactComponent as TipIcon} from "../../../../../core/ui/icons/tip.svg";
import {ReactComponent as AssetIcon} from "../../../../../core/ui/icons/asset.svg";
import {ReactComponent as CollectiblesIcon} from "../../../../../core/ui/icons/collectibles.svg";
import {ReactComponent as WarningIcon} from "../../../../../core/ui/icons/warning.svg";

const ASSET_OPTIN_INFO_MODAL_ID = "asset-opt-in-info-modal";

const ASSET_OPTIN_INFO_MODAL_TIPS = [
  {
    id: "header",
    icon: <TipIcon width={20} height={20} />,
    description: "What is opt-in?"
  },
  {
    id: "optin-to-asset",
    icon: <AssetIcon width={20} height={20} />,
    description:
      "Opt-in to an asset (eg. USDC) to be able to receive it from another user or application"
  },
  {
    id: "optin-to-collectibles",
    icon: <CollectiblesIcon width={20} height={20} />,
    description:
      "Opt-in to a collectible using its ID to be able to transfer it to your wallet"
  },
  {
    id: "optin-min-balance",
    icon: <WarningIcon width={20} height={20} />,
    description:
      "Account should have a minimum balance in order to compensate the transaction fee"
  }
];

export {ASSET_OPTIN_INFO_MODAL_ID, ASSET_OPTIN_INFO_MODAL_TIPS};
