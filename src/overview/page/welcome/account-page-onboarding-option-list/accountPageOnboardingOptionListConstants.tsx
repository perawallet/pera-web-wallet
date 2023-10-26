import createAccountImgSrc from "../../../../core/ui/image/create-account-illustration.png";
import recoveryPassphraseImgSrc from "../../../../core/ui/image/recovery-passphrase-illustration.png";
import createAccountDarkImgSrc from "../../../../core/ui/image/create-account-illustration.dark.png";
import recoveryPassphraseDarkImgSrc from "../../../../core/ui/image/recovery-passphrase-illustration.dark.png";

import ROUTES from "../../../../core/route/routes";

export interface AccountPageOnboardingOption {
  id: "create" | "importOptions";
  helperText: string;
  to: string;
  title: string;
  imgSrc: string;
}

function getAccountPageOnboardingOptionsList(
  theme: "dark" | "light"
): AccountPageOnboardingOption[] {
  return [
    {
      id: "create",
      helperText: "Create a new Algorand account",
      to: ROUTES.ACCOUNT.CREATE.FULL_PATH,
      title: "I want to create an account",
      imgSrc: theme === "dark" ? createAccountDarkImgSrc : createAccountImgSrc
    },
    {
      id: "importOptions",
      helperText: "Import an existing Algorand account from another device or backup",
      to: ROUTES.ACCOUNT.IMPORT.FULL_PATH,
      title: "I already have an account",
      imgSrc: theme === "dark" ? recoveryPassphraseDarkImgSrc : recoveryPassphraseImgSrc
    }
  ];
}

export {getAccountPageOnboardingOptionsList};
