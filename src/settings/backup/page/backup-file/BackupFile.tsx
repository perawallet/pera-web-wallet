import "./_backup-file.scss";

import {ReactComponent as SaveIcon} from "../../../../core/ui/icons/save.svg";
import {ReactComponent as TextFileIcon} from "../../../../core/ui/icons/text-file.svg";

import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

import {NO_OP} from "../../../../core/util/array/arrayUtils";
import ClipboardButton from "../../../../component/clipboard/button/ClipboardButton";
import useLocationWithState from "../../../../core/util/hook/useLocationWithState";
import LinkButton from "../../../../component/button/LinkButton";
import ROUTES from "../../../../core/route/routes";
import {formatBytes} from "../../../../core/util/number/numberUtils";
import {
  stringToUint8Array,
  uint8ArrayToBase64
} from "../../../../core/util/blob/blobUtils";

type LocationState = {cipher: string};

function BackupFile() {
  const navigate = useNavigate();
  const {cipher = ""} = useLocationWithState<LocationState>();
  const backupText = JSON.stringify({
    ciphertext: cipher,
    suite: "HMAC-SHA256:sodium_secretbox_easy",
    version: "1.0"
  });
  const backupBase64 = uint8ArrayToBase64(stringToUint8Array(backupText));
  const backupFile = new File(
    [backupBase64],
    `${new Date().toLocaleString().split(",")[0]}_backup.txt`,
    {
      type: "text/plain"
    }
  );
  const backupFileUrl = window.URL.createObjectURL(new Blob([backupFile]));

  useEffect(() => {
    if (!cipher) navigate(ROUTES.SETTINGS.ROUTE);
  }, [cipher, navigate]);

  return (
    <div className={"backup-file"}>
      <h2 className={"typography--h2"}>{"Your backup file is ready"}</h2>

      <p className={"text-color--gray-light backup-file__description"}>
        {"Save your file somewhere secure, in a different place to your 12-word key."}

        <a
          target={"_blank"}
          rel={"noopener noreferrer"}
          href={
            "https://support.perawallet.app/en/article/algorand-secure-backup-1m0zrg9/"
          }
          className={"typography--body backup-file__description-link"}>
          {" Learn More"}
        </a>
      </p>

      <div className={"backup-file__file-details-container"}>
        <div className={"backup-file__file-details"}>
          <TextFileIcon />

          <p className={"typography--medium-body backup-file__file-name"}>
            {backupFile.name}
          </p>

          <p className={"typography--secondary-body"}>{formatBytes(backupFile.size)}</p>
        </div>

        <div className={"backup-file__cta-wrapper"}>
          <ClipboardButton
            customClassName={"backup-file__copy-cta"}
            buttonType={"light"}
            textToCopy={backupText}
            copiedMessage={"Backup file copied to clipboard as text"}>
            {"Copy File"}
          </ClipboardButton>

          <LinkButton
            external={true}
            to={backupFileUrl}
            download={backupFile.name}
            customClassName={"backup-file__change-key-cta typography--body"}
            onClick={NO_OP}>
            <SaveIcon width={16} height={16} />

            {"Save Backup File"}
          </LinkButton>
        </div>
      </div>

      <LinkButton
        to={ROUTES.SETTINGS.ROUTE}
        buttonType={"secondary"}
        customClassName={"backup-file__next-cta"}>
        {"Back to Settings"}
      </LinkButton>
    </div>
  );
}

export default BackupFile;
