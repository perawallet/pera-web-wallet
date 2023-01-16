import "./_account-show-qr.scss";

import {useAppContext} from "../../../core/app/AppContext";
import ClipboardButton from "../../../component/clipboard/button/ClipboardButton";
import PeraQRCode from "../../../component/pera-qr-code/PeraQRCode";
import Button from "../../../component/button/Button";

interface AccountShowQRModalProps {
  address: string;
  onClose: VoidFunction;
}

export const ACCOUNT_SHOW_QR_MODAL_ID = "account-show-qr-modal";

function AccountShowQRModal({address, onClose}: AccountShowQRModalProps) {
  const {
    state: {accounts}
  } = useAppContext();

  const {name} = accounts[address];

  return (
    <div className={"account-show-qr-modal"}>
      <PeraQRCode value={address} />

      <p className={"typography--tagline text-color--gray-light text--uppercase"}>
        {"ADDRESS FOR ACCOUNT "}
        <span className={"text-color--main"}>{name}</span>
      </p>

      <p
        className={
          "typography--medium-body text-color--main account-show-qr-modal__address"
        }>
        {address}
      </p>

      <ClipboardButton
        textToCopy={address}
        buttonType={"secondary"}
        size={"small"}
        copiedMessage={"Account address copied!"}
        customClassName={
          "typography--secondary-button account-show-qr-modal__clipboard-button"
        }>
        {"Copy Address"}
      </ClipboardButton>

      <Button
        buttonType={"light"}
        customClassName={"account-show-qr-modal__close-button"}
        onClick={onClose}>
        {"Close"}
      </Button>
    </div>
  );
}

export default AccountShowQRModal;
