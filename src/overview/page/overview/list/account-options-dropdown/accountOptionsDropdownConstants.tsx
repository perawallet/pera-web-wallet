import {ReactComponent as CopyIcon} from "../../../../../core/ui/icons/copy.svg";
import {ReactComponent as QRCodeIcon} from "../../../../../core/ui/icons/qr-code.svg";
import {ReactComponent as KeyIcon} from "../../../../../core/ui/icons/key.svg";
import {ReactComponent as ShareIcon} from "../../../../../core/ui/icons/share.svg";
import {ReactComponent as OptinIcon} from "../../../../../core/ui/icons/opt-in.svg";
import {ReactComponent as PenIcon} from "../../../../../core/ui/icons/pen.svg";
import {ReactComponent as UnlinkIcon} from "../../../../../core/ui/icons/unlink.svg";

export const ACCOUNT_DROPDOWN_OPTIONS = [
  {
    id: "copy-address",
    title: "Copy address",
    icon: <CopyIcon width={16} height={16} />
  },
  {
    id: "show-qr",
    title: "View account QR",
    icon: <QRCodeIcon width={16} height={16} />
  },
  {
    id: "show-passphrase",
    title: "View passphrase",
    icon: <KeyIcon width={16} height={16} />
  },
  {
    id: "send-transaction",
    title: "Send transaction",
    icon: <ShareIcon width={16} height={16} />
  },
  {
    id: "opt-in-to-asset",
    title: "Opt-in to asset",
    icon: <OptinIcon width={16} height={16} />
  },
  {
    id: "rename-account",
    title: "Rename account",
    icon: <PenIcon width={16} height={16} />
  },
  {
    id: "remove-account",
    title: "Remove account",
    icon: <UnlinkIcon width={16} height={16} />
  }
] as const;
