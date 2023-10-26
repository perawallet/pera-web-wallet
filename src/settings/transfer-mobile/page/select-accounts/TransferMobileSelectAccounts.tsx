import "./_transfer-mobile-select-accounts.scss";

import {ReactComponent as InfoIcon} from "../../../../core/ui/icons/info.svg";

import {Navigate} from "react-router-dom";
import {useCallback, useEffect, useMemo, useState} from "react";

import GoBackButton from "../../../../component/go-back-button/GoBackButton";
import {usePortfolioContext} from "../../../../overview/context/PortfolioOverviewContext";
import useAsyncProcess from "../../../../core/network/async-process/useAsyncProcess";
import useNavigateFlow from "../../../../core/route/navigate/useNavigateFlow";
import {useSimpleToaster} from "../../../../component/simple-toast/util/simpleToastHooks";
import ROUTES from "../../../../core/route/routes";
import {useAppContext} from "../../../../core/app/AppContext";
import {
  decryptSK,
  encryptAccountBackup,
  generateKey
} from "../../../../core/util/nacl/naclUtils";
import {peraApi} from "../../../../core/util/pera/api/peraApi";
import {STORED_KEYS} from "../../../../core/util/storage/web/webStorage";
import {encryptedWebStorageUtils} from "../../../../core/util/storage/web/webStorageUtils";
import {uint8ArrayToBase64} from "../../../../core/util/blob/blobUtils";
import SimpleLoader from "../../../../component/loader/simple/SimpleLoader";
import Tooltip from "../../../../component/tooltip/Tooltip";
import {getAccountType} from "../../../../account/util/accountUtils";
import {AccountBackup, MobileSyncAccount} from "../../../../account/accountModels";
import MultipleSelectableAccountList from "../../../../account/component/list/selectable/MultipleSelectableAccountList";

function TransferMobileSelectAccounts() {
  const portfolioOverview = usePortfolioContext()!;
  const {
    state: {masterkey, preferredNetwork, hasAccounts}
  } = useAppContext();
  const {
    runAsyncProcess,
    state: {data, error, isRequestPending}
  } = useAsyncProcess<AccountBackup>();
  const navigate = useNavigateFlow();
  const simpleToaster = useSimpleToaster();
  const encryptionKey = useMemo(() => generateKey(), []);
  const [filteredAccounts, setFilteredAccounts] = useState<AccountOverview[]>();
  const toggledNetwork = preferredNetwork === "mainnet" ? "testnet" : "mainnet";

  const handleToastError = useCallback(
    (toastError: any) => {
      console.error(toastError);

      simpleToaster.display({
        type: "error",
        message: "An error occured, please try again later."
      });
    },
    [simpleToaster]
  );

  useEffect(() => {
    if (!portfolioOverview) return;

    // ledger accounts (in both network) can not be exported
    const notRekeyedStandardAccounts = Object.values(portfolioOverview.accounts).filter(
      (account) => getAccountType(account) !== "ledger"
    );

    setFilteredAccounts(notRekeyedStandardAccounts.filter(Boolean) as AccountOverview[]);
  }, [portfolioOverview, toggledNetwork, preferredNetwork]);

  useEffect(() => {
    if (data) {
      const {id: backupId} = data;

      navigate(ROUTES.SETTINGS.TRANSFER_MOBILE.QR.ROUTE, {
        state: {backupId, encryptionKey}
      });
    }

    if (error) handleToastError(error);
  }, [data, encryptionKey, error, handleToastError, navigate, simpleToaster]);

  if (!hasAccounts) return <Navigate to={ROUTES.ACCOUNT.CREATE.FULL_PATH} />;

  if (!filteredAccounts) {
    return (
      <div className={"transfer-mobile-accounts__wrapper--empty"}>
        <SimpleLoader />
      </div>
    );
  }

  return (
    <div className={"transfer-mobile-accounts__wrapper"}>
      <GoBackButton
        customClassName={"transfer-mobile-accounts__wrapper__go-back-button"}
        text={"Select accounts to transfer"}>
        <Tooltip
          content={"Rekeyed and Ledger Accounts can not be exported."}
          dataFor={"transfer-mobile-accounts__wrapper"}>
          <InfoIcon width={20} height={20} />
        </Tooltip>
      </GoBackButton>

      <p className={"transfer-mobile-accounts__subheader text-color--gray"}>
        {"Select the accounts to transfer to Pera Mobile"}
      </p>

      <div className={"transfer-mobile-accounts__select-form-wrapper"}>
        <MultipleSelectableAccountList
          customClassName={"transfer-mobile-accounts__select-form"}
          accounts={filteredAccounts}
          toggleAllCheckboxContent={<span className={"text-color--gray-lighter"} />}
          isInitiallyAllChecked={true}
          onFormSubmit={handleAccountExporting}
          shouldDisplaySpinner={isRequestPending}
        />
      </div>
    </div>
  );

  async function handleAccountExporting(addresses: string[]) {
    try {
      const selectedAccounts: MobileSyncAccount[] = [];

      for (const selectedAccountAddress of addresses) {
        const {name, pk: encryptedPk} =
          portfolioOverview.accounts[selectedAccountAddress as string];

        // eslint-disable-next-line no-continue
        if (!encryptedPk) continue;

        const pkByteArray = await decryptSK(encryptedPk, masterkey!);

        selectedAccounts.push({
          name,
          address: selectedAccountAddress as string,
          account_type: "single",
          private_key: uint8ArrayToBase64(pkByteArray)
        });
      }

      const cipher = encryptAccountBackup(
        JSON.stringify(selectedAccounts),
        encryptionKey
      );
      const deviceInfo = (await encryptedWebStorageUtils(masterkey!).get(
        STORED_KEYS.DEVICE_INFO
      )) as DeviceInfo;
      const {deviceId} = deviceInfo[preferredNetwork];

      if (!cipher || !deviceId) {
        handleToastError(new Error("Encryption error"));
        return;
      }

      runAsyncProcess(peraApi.createAccountBackup(deviceId, uint8ArrayToBase64(cipher)));
    } catch (e) {
      console.error(e);

      handleToastError(new Error("Unexpected Error"));
    }
  }
}

export default TransferMobileSelectAccounts;
