import "./_account-import-backup-file.scss";

import {ReactComponent as PenIcon} from "../../../../../core/ui/icons/pen.svg";
import {ReactComponent as UploadIcon} from "../../../../../core/ui/icons/upload.svg";

import {SyntheticEvent, useState} from "react";
import {FormField, Textarea} from "@hipo/react-ui-toolkit";

import ROUTES from "../../../../../core/route/routes";
import Button from "../../../../../component/button/Button";
import GoBackButton from "../../../../../component/go-back-button/GoBackButton";
import FileInput from "../../../../../component/input/file-input/FileInput";
import LinkButton from "../../../../../component/button/LinkButton";

function AccountImportBackupFile() {
  const [backupCipher, setBackupCipher] = useState<string>("");
  const [inputType, setInputType] = useState<"file" | "text">("file");

  return (
    <div className={"account-import-backup-file"}>
      <GoBackButton text={"Select your backup file"} />

      <p className={"text-color--gray account-import-backup-file__description"}>
        {"To restore your wallet, select or paste your backup file."}
      </p>

      {inputType === "file" ? (
        <FileInput onFileUpload={handleFileUpload} />
      ) : (
        <FormField
          customClassName={"account-import-backup-file__input-label"}
          label={"Backup file text"}
          labelFor={"import-backup-file-input"}>
          <Textarea
            name={"account-import-backup-file__input"}
            onChange={handleBackupTextChange}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
          />
        </FormField>
      )}

      <Button
        buttonType={"light"}
        onClick={toggleInputType}
        customClassName={"account-import-backup-file__change-input-cta button--fluid"}>
        {inputType === "file" ? (
          <PenIcon width={16} height={16} />
        ) : (
          <UploadIcon width={16} height={16} />
        )}

        {inputType === "file" ? "Enter backup file as text" : "Upload Backup file"}
      </Button>

      <LinkButton
        isDisabled={!backupCipher}
        to={ROUTES.ACCOUNT.IMPORT.BACKUP.PASSPHRASE.FULL_PATH}
        state={{backupCipher}}
        customClassName={"account-import-backup-file__next-cta"}>
        {"Next"}
      </LinkButton>
    </div>
  );

  function toggleInputType() {
    setInputType((oldState) => (oldState === "file" ? "text" : "file"));
  }

  function handleBackupTextChange(event: SyntheticEvent<HTMLTextAreaElement>) {
    setBackupCipher(event.currentTarget.value);
  }

  function handleFileUpload(file: string) {
    setBackupCipher(file);
  }
}

export default AccountImportBackupFile;
