import {ReactComponent as ActivityIcon} from "../../../../core/ui/icons/activity.svg";
import {ReactComponent as NodeIcon} from "../../../../core/ui/icons/node.svg";
import {ReactComponent as BroomIcon} from "../../../../core/ui/icons/broom.svg";
import {ReactComponent as LockIcon} from "../../../../core/ui/icons/lock-2.svg";
import {ReactComponent as DesktopMobileIcon} from "../../../../core/ui/icons/desktop-mobile.svg";
import {ReactComponent as MoonIcon} from "../../../../core/ui/icons/moon.svg";
import {ReactComponent as BackupIcon} from "../../../../core/ui/icons/backup.svg";

const CHANGE_PASSCODE_MODAL_ID = "change-passcode-modal";

const SETTINGS_PAGE_ITEMS = [
  {
    id: "theme",
    title: "Theme",
    description: "Choose between light and dark mode.",
    learnMore: null,
    icon: <MoonIcon />,
    shouldShowNew: true
  },
  {
    id: "asb",
    title: "Algorand Secure Backup",
    description:
      "Generate an encrypted backup for all your accounts using the Algorand Secure Backup protocol.",
    learnMore: null,
    icon: <BackupIcon />,
    shouldShowNew: true
  },

  {
    id: "session",
    title: "Pera Connect Sessions",
    description: "View and disconnect your Pera Connect sessions.",
    learnMore: null,
    icon: <ActivityIcon />,
    shouldShowNew: false
  },
  {
    id: "node",
    title: "Node Settings",
    description:
      "Run Pera on Testnet to test your wallet with new assets, accounts and configurations\nwithout having to send real ALGO or pay for transaction fees.",
    learnMore:
      "https://support.perawallet.app/en/article/connecting-to-testnet-developer-mode-1q638cf/",
    icon: <NodeIcon />,
    shouldShowNew: false
  },
  {
    id: "transfer-mobile",
    title: "Transfer to Pera Mobile",
    description: "Transfer your accounts to a Pera Mobile device",
    learnMore: null,
    icon: <DesktopMobileIcon />,
    shouldShowNew: false
  },

  {
    id: "change-passcode",
    title: "Change Passcode",
    description: "Change your passcode",
    learnMore: null,
    icon: <LockIcon />,
    shouldShowNew: false
  },
  {
    id: "clear-wallet",
    title: "Clear Wallet Data",
    description:
      "Unlink all your Algorand accounts from this device by removing your passcode.",
    learnMore: null,
    icon: <BroomIcon />,
    shouldShowNew: false
  }
] as const;

export {CHANGE_PASSCODE_MODAL_ID, SETTINGS_PAGE_ITEMS};
