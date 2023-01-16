import {ReactComponent as ArrowRightIcon} from "../../../core/ui/icons/arrow-right.svg";
import {ReactComponent as KeyIcon} from "../../../core/ui/icons/key.svg";

import "./_account-show-passphrase.scss";

import algosdk from "algosdk";
import {Navigate} from "react-router-dom";
import {useEffect} from "react";
import {List, ListItem} from "@hipo/react-ui-toolkit";

import ClipboardButton from "../../../component/clipboard/button/ClipboardButton";
import InfoBox from "../../../component/info-box/InfoBox";
import {useAppContext} from "../../../core/app/AppContext";
import {decryptSK} from "../../../core/util/nacl/naclUtils";
import useAsyncProcess from "../../../core/network/async-process/useAsyncProcess";
import ROUTES from "../../../core/route/routes";
import Button from "../../../component/button/Button";
import PeraLoader from "../../../component/loader/pera/PeraLoader";

interface AccountShowPassphraseModalProps {
  address: string;
  onClose: VoidFunction;
}

export const ACCOUNT_SHOW_PASSPHRASE_MODAL_ID = "account-show-passphrase-modal";

function AccountShowPassphraseModal({address, onClose}: AccountShowPassphraseModalProps) {
  const {
    state: {accounts, masterkey}
  } = useAppContext();
  const {
    runAsyncProcess,
    state: {data: passphrase, error, isRequestFetched}
  } = useAsyncProcess<string>();

  useEffect(() => {
    runAsyncProcess(deriveAccountMnemonic());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <Navigate to={ROUTES.OVERVIEW.ROUTE} />;
  }

  if (!isRequestFetched) {
    return <PeraLoader mode={"gray"} />;
  }

  return (
    <div className={"account-show-passphrase-modal"}>
      <h1 className={"account-show-passphrase-modal__header"}>{"View Passphrase"}</h1>

      <InfoBox
        className={"account-show-passphrase-modal__info-box "}
        infoText={
          "Your recovery passphrase is the key to your Algorand account. Record the following words with their corresponding number somewhere secure."
        }
        icon={<KeyIcon />}>
        <a
          href={
            "https://support.perawallet.app/en/article/backing-up-your-recovery-passphrase-uacy9k/"
          }
          target={"_blank"}
          rel={"noreferrer"}
          className={
            "typography--secondary-bold-body text-color--main account-show-passphrase-modal__learn-more-link"
          }>
          {"Learn more"}

          <ArrowRightIcon width={16} height={16} />
        </a>
      </InfoBox>

      <List
        items={passphrase!.split(" ")}
        customClassName={"account-show-passphrase-modal__passphrase-list"}
        type={"ordered"}>
        {(word) => (
          <ListItem
            customClassName={"account-show-passphrase-modal__passphrase-list-item"}>
            {word}
          </ListItem>
        )}
      </List>

      <ClipboardButton
        textToCopy={passphrase!}
        size={"large"}
        copiedMessage={"Account passphrase copied!"}
        customClassName={"account-overview-modal__clipboard-button"}>
        {"Copy Passphrase"}
      </ClipboardButton>

      <Button
        buttonType={"light"}
        customClassName={"account-show-passphrase-modal__close-button"}
        onClick={handleCloseClick}>
        {"Close"}
      </Button>
    </div>
  );

  async function deriveAccountMnemonic() {
    const secretKey = await decryptSK(accounts[address!].pk, masterkey!);
    const mnemonic = algosdk.secretKeyToMnemonic(secretKey!);

    return mnemonic;
  }

  function handleCloseClick() {
    onClose();
  }
}

export default AccountShowPassphraseModal;
