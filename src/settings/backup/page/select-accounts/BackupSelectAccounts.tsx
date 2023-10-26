import "./_backup-select-accounts.scss";

import {ReactComponent as InfoIcon} from "../../../../core/ui/icons/info.svg";

import {useNavigate} from "react-router-dom";

import GoBackButton from "../../../../component/go-back-button/GoBackButton";
import {usePortfolioContext} from "../../../../overview/context/PortfolioOverviewContext";
import {useAppContext} from "../../../../core/app/AppContext";
import {decryptSK, generateASBKeyPassphrase} from "../../../../core/util/nacl/naclUtils";
import {STORED_KEYS} from "../../../../core/util/storage/web/webStorage";
import {encryptedWebStorageUtils} from "../../../../core/util/storage/web/webStorageUtils";
import Tooltip from "../../../../component/tooltip/Tooltip";
import {uint8ArrayToBase64} from "../../../../core/util/blob/blobUtils";
import {ARCStandardMobileSyncAccount} from "../../../../account/accountModels";
import MultipleSelectableAccountList from "../../../../account/component/list/selectable/MultipleSelectableAccountList";
import ROUTES from "../../../../core/route/routes";
import {getAccountType} from "../../../../account/util/accountUtils";

function BackupSelectAccounts() {
  const navigate = useNavigate();
  const portfolioOverview = usePortfolioContext();
  const {
    state: {masterkey, preferredNetwork}
  } = useAppContext();

  return (
    <div className={"backup-modal-accounts__wrapper"}>
      <GoBackButton text={"Choose accounts to backup"}>
        <Tooltip
          content={"Rekeyed and Ledger Accounts can not be backed up."}
          dataFor={"backup-modal-accounts__wrapper"}>
          <InfoIcon width={20} height={20} />
        </Tooltip>
      </GoBackButton>

      <MultipleSelectableAccountList
        customClassName={"backup-modal-accounts__select-form"}
        accounts={getFilteredUserAccounts()}
        isInitiallyAllChecked={true}
        onFormSubmit={handleAccountExporting}
      />
    </div>
  );

  async function handleAccountExporting(addresses: string[]) {
    try {
      const selectedAccounts: ARCStandardMobileSyncAccount[] = [];

      for (const selectedAccountAddress of addresses) {
        const {name, pk: encryptedPk} =
          portfolioOverview.accounts[selectedAccountAddress as string];

        const pkByteArray = await decryptSK(encryptedPk!, masterkey!);

        selectedAccounts.push({
          name,
          address: selectedAccountAddress as string,
          account_type: "single",
          private_key: uint8ArrayToBase64(pkByteArray)
        });
      }

      const deviceInfo = (await encryptedWebStorageUtils(masterkey!).get(
        STORED_KEYS.DEVICE_INFO
      )) as DeviceInfo;
      const {deviceId} = deviceInfo[preferredNetwork];

      const savedPassphrase = (await encryptedWebStorageUtils(masterkey!).get(
        STORED_KEYS.BACKUP_PASSPHRASE
      )) as string;
      const passphrase = savedPassphrase || generateASBKeyPassphrase();

      await encryptedWebStorageUtils(masterkey!).set(
        STORED_KEYS.BACKUP_PASSPHRASE,
        passphrase
      );

      navigate(ROUTES.SETTINGS.BACKUP.PASSPHRASE.ROUTE, {
        state: {passphrase, selectedAccounts, deviceId}
      });
    } catch (e) {
      console.error(e);

      // TODO handle error state here
    }
  }

  function getFilteredUserAccounts() {
    // ledger and rekeyed accounts not supported in export to mobile
    return Object.values(portfolioOverview!.accounts).filter(
      (account) =>
        !account.rekeyed_to &&
        getAccountType(portfolioOverview!.accounts[account.address]) !== "ledger"
    );
  }
}

export default BackupSelectAccounts;
