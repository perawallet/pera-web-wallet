import {ReactComponent as SafeIcon} from "../../../../../core/ui/icons/safe.svg";
import {ReactComponent as KeyIcon} from "../../../../../core/ui/icons/key.svg";

import Button from "../../../../../component/button/Button";

interface ClearWalletDataModalBackupViewProps {
  onBackedUpClick: VoidFunction;
}

function ClearWalletDataModalBackupView({
  onBackedUpClick
}: ClearWalletDataModalBackupViewProps) {
  return (
    <>
      <div className={"clear-wallet-data-modal__icon-wrapper"}>
        <SafeIcon />
      </div>

      <h2 className={"typography--h2 text-color--main clear-wallet-data-modal__heading"}>
        {"Have you backed up your accounts?"}
      </h2>

      <p className={"typography--body text-color--gray text--centered"}>
        {
          "Before clearing your accounts, make sure you have backed up all your recovery passphrases."
        }
      </p>

      <div className={"clear-wallet-data-modal__helper"}>
        <div className={"clear-wallet-data-modal__helper-icon-wrapper"}>
          <KeyIcon width={16} height={16} />
        </div>

        <a
          href={
            "https://support.perawallet.app/en/article/backing-up-your-recovery-passphrase-uacy9k/"
          }
          target={"_blank"}
          rel={"noopener noreferrer"}
          className={
            "typography--secondary-bold-body clear-wallet-data-modal__helper-link"
          }>
          {"Learn how to backup your accounts →"}
        </a>
      </div>

      <Button
        buttonType={"primary"}
        size={"large"}
        onClick={onBackedUpClick}
        customClassName={"clear-wallet-data-modal__backed-up-cta"}>
        {"Yes, I’ve backed up my accounts"}
      </Button>
    </>
  );
}

export default ClearWalletDataModalBackupView;
