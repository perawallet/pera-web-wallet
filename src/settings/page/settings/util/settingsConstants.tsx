import {ReactComponent as ActivityIcon} from "../../../../core/ui/icons/activity.svg";
import {ReactComponent as NodeIcon} from "../../../../core/ui/icons/node.svg";
import {ReactComponent as BroomIcon} from "../../../../core/ui/icons/broom.svg";

const SETTINGS_PAGE_ITEMS = [
  {
    id: "session",
    title: "Pera Connect Sessions",
    description: "View and disconnect your Pera Connect sessions.",
    learnMore: null,
    icon: <ActivityIcon />
  },
  {
    id: "node",
    title: "Node Settings",
    description:
      "Run Pera on Testnet to test your wallet with new assets, accounts and configurations without having to send real ALGO or pay for transaction fees.",
    learnMore:
      "https://support.perawallet.app/en/article/connecting-to-testnet-developer-mode-1q638cf/",
    icon: <NodeIcon />
  },
  {
    id: "clear-wallet",
    title: "Clear Wallet Data",
    description:
      "Unlink all your Algorand accounts from this device by removing your passcode.",
    learnMore: null,
    icon: <BroomIcon />
  }
] as const;

export {SETTINGS_PAGE_ITEMS};
