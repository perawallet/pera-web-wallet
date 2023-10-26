import {ReactComponent as CopyIcon} from "../../../../../core/ui/icons/copy.svg";
import {ReactComponent as QRCodeIcon} from "../../../../../core/ui/icons/qr-code.svg";
import {ReactComponent as KeyIcon} from "../../../../../core/ui/icons/key.svg";
import {ReactComponent as RekeyIcon} from "../../../../../core/ui/icons/rekey.svg";
import {ReactComponent as UndoIcon} from "../../../../../core/ui/icons/undo.svg";
import {ReactComponent as ShareIcon} from "../../../../../core/ui/icons/share.svg";
import {ReactComponent as OptinIcon} from "../../../../../core/ui/icons/opt-in.svg";
import {ReactComponent as PenIcon} from "../../../../../core/ui/icons/pen.svg";
import {ReactComponent as UnlinkIcon} from "../../../../../core/ui/icons/unlink.svg";

export type AccountDropdownOption = {
  id:
    | "copy-address"
    | "show-qr"
    | "show-passphrase"
    | "rekey-undo"
    | "rekey-ledger"
    | "rekey-standard"
    | "send-transaction"
    | "opt-in-to-asset"
    | "rename-account"
    | "remove-account";
  title: string;
  icon: React.ReactNode;
  description?: string;
};

export const ACCOUNT_DROPDOWN_OPTIONS: AccountDropdownOption[] = [
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
    id: "rekey-undo",
    title: "Undo Rekey",
    icon: <UndoIcon width={16} height={16} />,
    description: "Algo Wallet"
  },
  {
    id: "rekey-ledger",
    title: "Rekey to Ledger",
    icon: <RekeyIcon width={16} height={16} />
  },
  {
    id: "rekey-standard",
    title: "Rekey to Standard",
    icon: <RekeyIcon width={16} height={16} />
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
];
