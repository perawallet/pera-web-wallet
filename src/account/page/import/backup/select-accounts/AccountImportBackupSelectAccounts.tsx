import "./_account-import-backup-select-accounts.scss";

import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

import GoBackButton from "../../../../../component/go-back-button/GoBackButton";
import {useAppContext} from "../../../../../core/app/AppContext";
import MultipleSelectableAccountList from "../../../../../account/component/list/selectable/MultipleSelectableAccountList";
import useLocationWithState from "../../../../../core/util/hook/useLocationWithState";
import ROUTES from "../../../../../core/route/routes";
import {appDBManager} from "../../../../../core/app/db";
import {encryptSK} from "../../../../../core/util/nacl/naclUtils";
import {base64ToUint8Array} from "../../../../../core/util/blob/blobUtils";

type LocationState = {
  backupAccounts: Record<string, AccountOverview & {name: string; private_key: string}>;
};

function AccountImportBackupSelectAccounts() {
  const navigate = useNavigate();
  const {
    state: {masterkey}
  } = useAppContext();
  const {backupAccounts} = useLocationWithState<LocationState>();
  const accounts = backupAccounts ? Object.values(backupAccounts) : [];

  useEffect(() => {
    if (!backupAccounts) navigate(ROUTES.ACCOUNT.IMPORT.BACKUP.FULL_PATH);
  }, [backupAccounts, navigate]);

  if (!backupAccounts) return null;

  return (
    <div className={"account-import-backup-modal-accounts__wrapper"}>
      <GoBackButton text={"Choose accounts to restore"} />

      <MultipleSelectableAccountList
        customClassName={"account-import-backup-modal-accounts__select-form"}
        toggleAllCheckboxContent={
          <span className={"text-color--gray-light"}>
            {`${accounts.length} account${accounts.length > 1 ? "s" : ""} available`}
          </span>
        }
        accounts={accounts}
        isInitiallyAllChecked={true}
        onFormSubmit={handleImportAccountBackup}
      />
    </div>
  );

  async function handleImportAccountBackup(addresses: string[]) {
    try {
      const dbAccountEntries: (AppDBAccount & {total_algo_value: string})[] = [];

      for (const selectedAccountAddress of addresses) {
        const {name, address, total_algo_value, private_key} =
          backupAccounts![selectedAccountAddress as string];
        const pk = await encryptSK(base64ToUint8Array(private_key), masterkey!);

        dbAccountEntries.push({
          name,
          address,
          pk,
          total_algo_value,
          date: new Date()
        });
      }

      await Promise.all(
        dbAccountEntries.map(({total_algo_value, ...entry}) =>
          appDBManager.set("accounts", masterkey!)(entry.address, entry)
        )
      );

      navigate(ROUTES.ACCOUNT.IMPORT.BACKUP.SUCCESS.FULL_PATH, {
        state: {importedAccounts: dbAccountEntries}
      });
    } catch (e) {
      console.error(e);

      // TODO handle error state here
    }
  }
}

export default AccountImportBackupSelectAccounts;
