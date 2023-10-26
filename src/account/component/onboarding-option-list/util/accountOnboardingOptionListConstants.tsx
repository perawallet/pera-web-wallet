import {ReactComponent as BackupIcon} from "../../../../core/ui/icons/backup.svg";
import {ReactComponent as PeraIcon} from "../../../../core/ui/icons/pera.svg";
import {ReactComponent as LedgerIcon} from "../../../../core/ui/icons/ledger.svg";
import {ReactComponent as KeyIcon} from "../../../../core/ui/icons/key.svg";

import {LinkProps} from "react-router-dom";

import ROUTES from "../../../../core/route/routes";

export interface AccountImportOptions {
  id: "secure-backup" | "import" | "nano" | "recovery";
  icon: React.ReactNode;
  title: string;
  description: string;
  to: LinkProps["to"];
  shouldShowNew?: boolean;
  shouldShowComingSoon?: boolean;
}

const ACCOUNT_ONBOARDING_OPTIONS: Array<AccountImportOptions> = [
  {
    id: "import",
    icon: <PeraIcon width={24} height={24} />,
    title: "Import from Pera Mobile",
    description: "I want to import Algorand accounts from Pera Mobile ",
    to: ROUTES.ACCOUNT.IMPORT.PERA_SYNC.FULL_PATH
  },
  // TODO: Update this after secure backup comes out
  {
    id: "secure-backup",
    icon: <BackupIcon width={24} height={24} />,
    title: "Algorand Secure Backup",
    description:
      "I want to restore my accounts using an Algorand Secure Backup file and 12-word key",
    to: "",
    shouldShowComingSoon: true
  },
  {
    id: "nano",
    icon: <LedgerIcon width={24} height={24} />,
    title: "Pair Ledger Device",
    description: "I want to add an account managed by my Ledger Nano X or S",
    to: ROUTES.ACCOUNT.IMPORT.LEDGER.FULL_PATH
  },
  {
    id: "recovery",
    icon: <KeyIcon width={24} height={24} />,
    title: "Use Recovery Passphrase",
    description: "I want to import an Algorand account using its 25-word passphrase",
    to: ROUTES.ACCOUNT.IMPORT.PASSPHRASE.FULL_PATH
  }
];

const ACCOUNT_QUICK_ACCESS_OPTIONS: Array<AccountImportOptions> = [
  {
    id: "import",
    icon: <PeraIcon width={24} height={24} />,
    title: "Import from Pera Mobile",
    description: "Import Algorand accounts from Pera Mobile",
    to: ROUTES.ACCOUNT.IMPORT.PERA_SYNC.FULL_PATH
  },
  // TODO: Update this after secure backup comes out
  {
    id: "recovery",
    icon: <KeyIcon width={24} height={24} />,
    title: "Use Recovery Passphrase",
    description: "I want to import an Algorand account using its 25-word passphrase",
    to: ROUTES.ACCOUNT.IMPORT.PASSPHRASE.FULL_PATH
  },
  {
    id: "nano",
    icon: <LedgerIcon width={24} height={24} />,
    title: "Pair Ledger Device",
    description: "Add an account managed by your Ledger Nano X or S",
    to: ROUTES.ACCOUNT.IMPORT.LEDGER.FULL_PATH
  }
];

function getAccountOnboardingOptions(type: "default" | "quick-access") {
  if (type === "quick-access") {
    return ACCOUNT_QUICK_ACCESS_OPTIONS;
  }

  return ACCOUNT_ONBOARDING_OPTIONS;
}

export {getAccountOnboardingOptions};
