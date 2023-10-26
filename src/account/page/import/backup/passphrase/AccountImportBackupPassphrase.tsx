import "./_account-import-backup-passphrase.scss";

import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useToaster} from "@hipo/react-ui-toolkit";

// import ROUTES from "../../../../../core/route/routes";
// import useNavigateFlow from "../../../../../core/route/navigate/useNavigateFlow";

import PeraToast from "../../../../../component/pera-toast/PeraToast";
import AccountMnemonicForm from "../../../../component/account-mnemonic-form/AccountMnemonicForm";
import useLocationWithState from "../../../../../core/util/hook/useLocationWithState";
import ROUTES from "../../../../../core/route/routes";
import {decryptAlgorandSecureBackup} from "../../../../../core/util/nacl/naclUtils";
import {ARCStandardMobileSyncAccount} from "../../../../accountModels";
import {peraApi} from "../../../../../core/util/pera/api/peraApi";
import {generateKeyMapFromArray} from "../../../../../core/util/array/arrayUtils";

type LocationState = {backupCipher: string};

function AccountImportBackupPassphrase() {
  const navigate = useNavigate();
  const toaster = useToaster();
  const {backupCipher} = useLocationWithState<LocationState>();

  useEffect(() => {
    if (!backupCipher) navigate(ROUTES.ACCOUNT.IMPORT.BACKUP.FULL_PATH);
  }, [backupCipher, navigate]);

  return (
    <div className={"account-import-backup-passphrase"}>
      <h2
        className={
          "typography--h2 text-color--main account-import-backup-passphrase__title"
        }>
        {"Enter 12-word key"}
      </h2>

      <p className={"typography--body text-color--gray"}>
        {"Enter your recovery passphrase in the correct order."}
      </p>

      <p
        className={
          "typography--medium-body text-color--main  account-import-backup-passphrase__description"
        }>
        {"You can paste your passphrase as 12-word separated with commas or spaces."}
      </p>

      <AccountMnemonicForm
        onFormSubmit={handleImportAccountMnemonic}
        mnemonicLength={12}
        customClassname={"account-import-backup-passphrase__mnemonic-form"}
        ctaText={"Next"}
      />
    </div>
  );

  async function handleImportAccountMnemonic(mnemonicKeys: string[]) {
    const mnemonic = mnemonicKeys.join(" ");

    try {
      const {ciphertext} = JSON.parse(backupCipher!) as {
        version: string;
        suite: string;
        ciphertext: string;
      };

      console.log({ciphertext});

      if (!ciphertext) throw new Error("Wrong backup format");

      const backup = (await decryptAlgorandSecureBackup({
        cipher: ciphertext,
        mnemonic
      })) as unknown as {accounts: ARCStandardMobileSyncAccount[]};

      const backupAccountKeyMap = generateKeyMapFromArray(backup.accounts, "address");

      // TODO: add overview to appState and DB here to prevent success page glitches
      // TODO: add zero balanced accounts as well
      const backupOverview = await peraApi.getMultipleAccountOverview({
        account_addresses: backup.accounts.map((account) => account.address)
      });

      for (const accountOverview of Object.values(backupOverview.accounts)) {
        const {domainName, address, ...overviewDetails} = accountOverview;

        backupAccountKeyMap[address] = {
          ...backupAccountKeyMap[address],
          ...overviewDetails
        };

        if (domainName) {
          backupAccountKeyMap[address].name = domainName.name;
        }
      }

      navigate(ROUTES.ACCOUNT.IMPORT.BACKUP.ACCOUNTS.FULL_PATH, {
        state: {backupAccounts: backupAccountKeyMap}
      });
    } catch (error: any) {
      console.error(error);

      toaster.display({
        render() {
          return (
            <PeraToast
              type={"warning"}
              title={"Decryption Error"}
              detail={"Backup and passphrase mismatched."}
              hasCloseButton={false}
            />
          );
        }
      });
    }
  }
}

export default AccountImportBackupPassphrase;
