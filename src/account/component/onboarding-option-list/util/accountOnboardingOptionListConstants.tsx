import {ReactComponent as WalletIcon} from "../../../../core/ui/icons/wallet.svg";
import {ReactComponent as KeyIcon} from "../../../../core/ui/icons/key.svg";
import {ReactComponent as SyncIcon} from "../../../../core/ui/icons/sync.svg";
import createAccountImgSrc from "../../../../core/ui/image/create-account-illustration.png";
import recoveryPassphraseImgSrc from "../../../../core/ui/image/recovery-passphrase-illustration.png";
import importFromMobileImgSrc from "../../../../core/ui/image/import-from-mobile-illustration.png";

import ROUTES from "../../../../core/route/routes";

const ACCOUNT_ONBOARDING_OPTIONS = [
  {
    id: "create",
    icon: <WalletIcon />,
    helperText: "New to Pera?",
    to: ROUTES.ACCOUNT.CREATE.FULL_PATH,
    title: "Create an account",
    imgSrc: createAccountImgSrc
  },
  {
    id: "recovery-passphrase",
    icon: <KeyIcon />,
    helperText: "Already have an account?",
    to: ROUTES.ACCOUNT.IMPORT.PASSPHRASE.FULL_PATH,
    title: "Use Recovery Passphrase",
    imgSrc: recoveryPassphraseImgSrc
  },
  {
    id: "import-from-mobile",
    icon: <SyncIcon />,
    helperText: "Already a Pera Mobile user?",
    to: ROUTES.ACCOUNT.IMPORT.PERA_SYNC.FULL_PATH,
    title: "Import from Pera Mobile",
    imgSrc: importFromMobileImgSrc
  }
];

export {ACCOUNT_ONBOARDING_OPTIONS};
