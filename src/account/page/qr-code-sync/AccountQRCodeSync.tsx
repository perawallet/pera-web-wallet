import "./_account-qr-code-sync.scss";

import {List, ListItem} from "@hipo/react-ui-toolkit";
import {useMemo} from "react";
import {Navigate} from "react-router-dom";

import PeraQRCode from "../../../component/pera-qr-code/PeraQRCode";
import ROUTES from "../../../core/route/routes";
import useInterval from "../../../core/util/hook/useInterval";
import {peraApi} from "../../../core/util/pera/api/peraApi";
import {
  base64ToUint8Array,
  stringBytesToUint8Array,
  uint8ArrayToString
} from "../../../core/util/blob/blobUtils";
import {useAppContext} from "../../../core/app/AppContext";
import {
  PERA_SYNC_POLLING_INTERVAL,
  PERA_SYNC_POLLING_LIMIT,
  SYNC_MOBILE_TO_WEB_CONSTANTS,
  SYNC_WEB_TO_MOBILE_CONSTANTS
} from "./accountQRCodeSyncConstants";
import {
  decryptAccountBackup,
  encryptSK,
  generateKey
} from "../../../core/util/nacl/naclUtils";
import {appDBManager} from "../../../core/app/db";
import useLocationWithState from "../../../core/util/hook/useLocationWithState";
import {MobileSyncAccount} from "../../accountModels";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import {
  deriveAccountFromPrivateKey,
  isARCStandardMobileSyncAccount
} from "../../util/accountUtils";
import useNavigateFlow from "../../../core/route/navigate/useNavigateFlow";
import {AccountComponentFlows} from "../../util/accountTypes";
import {useConnectFlowContext} from "../../../connect/context/ConnectFlowContext";
import {usePortfolioContext} from "../../../overview/context/PortfolioOverviewContext";
import Button from "../../../component/button/Button";

interface AccountQRCodeSyncProps {
  sync: "web-to-mobile" | "mobile-to-web";
  flow?: AccountComponentFlows;
}

type LocationState = {
  modificationKey?: string;
  backupId?: string;
  encryptionKey?: Uint8Array;
};

// This component handles both mobile-to-web / web-to-mobile qr-code processes
function AccountQRCodeSync({sync, flow = "default"}: AccountQRCodeSyncProps) {
  const navigate = useNavigateFlow();
  const {backupId, modificationKey, encryptionKey} =
    useLocationWithState<LocationState>();
  const {
    state: {masterkey, hasAccounts},
    dispatch: dispatchAppState
  } = useAppContext();
  const {accounts: webAccounts} = usePortfolioContext()!;
  const simpleToaster = useSimpleToaster();
  const {formitoState, dispatchFormitoAction} = useConnectFlowContext();
  const isInConnectFlow = flow === "connect";
  const isWebToMobile = sync === "web-to-mobile";
  const backupState = useMemo(() => {
    const backup = {
      version: "1",
      action: isWebToMobile ? "import" : "export",
      platform: "web",
      backupId: (formitoState || {}).accountBackup?.backupId || backupId,
      modificationKey:
        (formitoState || {}).accountBackup?.modificationKey || modificationKey,
      encryptionKey: (encryptionKey || generateKey()).toString()
    };

    if (isWebToMobile) delete backup.modificationKey;

    return backup;
  }, [backupId, encryptionKey, formitoState, isWebToMobile, modificationKey]);

  const QR_CODE_SYNC_CONTANTS =
    sync === "web-to-mobile"
      ? SYNC_WEB_TO_MOBILE_CONSTANTS
      : SYNC_MOBILE_TO_WEB_CONSTANTS;

  // Polling;
  useInterval(handleAccountBackupPolling, PERA_SYNC_POLLING_INTERVAL, {
    shouldStartInterval: !isWebToMobile,
    shouldRunCallbackAtStart: true,
    refreshLimit: PERA_SYNC_POLLING_LIMIT
  });

  if (!isInConnectFlow && !backupId) {
    const to = isWebToMobile
      ? ROUTES.SETTINGS.ROUTE
      : ROUTES.ACCOUNT.IMPORT.PERA_SYNC.FULL_PATH;

    return <Navigate to={to} />;
  }

  return (
    <div className={"account-import-pera-qr"}>
      <h1 className={"typography--h2 text-color--main"}>{QR_CODE_SYNC_CONTANTS.TITLE}</h1>

      <div className={"account-import-pera__qr-code-wrapper"}>
        <PeraQRCode value={JSON.stringify(backupState)} />
      </div>

      <List
        items={QR_CODE_SYNC_CONTANTS.INSTRUCTIONS}
        customClassName={"account-import-pera__instruction-list"}>
        {(instruction, _, instructionIndex) => (
          <ListItem customClassName={"account-import-pera__instruction-list-item"}>
            <span
              className={
                "account-import-pera__instruction-list-item-index typography--medium-body"
              }>
              {String(instructionIndex! + 1)}
            </span>

            <span className={"account-import-pera__instruction-list-item-text"}>
              {instruction}
            </span>
          </ListItem>
        )}
      </List>

      {isWebToMobile && (
        <Button
          size={"large"}
          customClassName={"account-import-pera-qr__cta button--fluid"}
          onClick={handleCompleteExportAccounts}>
          {"Done"}
        </Button>
      )}
    </div>
  );

  async function handleAccountBackupPolling() {
    let cipher: string | null = null;

    try {
      const {encrypted_content} = (await peraApi.getAccountBackup(backupId!)) || {};

      cipher = encrypted_content;
    } catch (error) {
      console.error("API Error", error);
      return;
    }

    if (cipher) {
      // nacl returns null in case of decryption error
      const decryptedContent = decryptAccountBackup(
        cipher,
        stringBytesToUint8Array(backupState.encryptionKey)
      );

      if (!decryptedContent) {
        console.error("Encryption Error");
        return;
      }

      let mobileAccounts: MobileSyncAccount[] | null = null;

      try {
        const {accounts} = JSON.parse(uint8ArrayToString(decryptedContent));

        mobileAccounts = accounts as MobileSyncAccount[];
      } catch (error) {
        console.error("JSON Parse Error");
        return;
      }

      // this method handles individual account errors inside
      const importedAccounts = await handleImportAccounts(
        mobileAccounts as MobileSyncAccount[]
      );

      if (importedAccounts.length === 0) {
        simpleToaster.display({
          message: "There is no new account to be synced.",
          type: "info"
        });

        if (isInConnectFlow) {
          dispatchFormitoAction({
            type: "SET_FORM_VALUE",
            payload: {
              connectFlowView: "add-account"
            }
          });
        } else {
          navigate(ROUTES.ACCOUNT.ROUTE);
        }

        return;
      }

      if (isInConnectFlow) {
        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {
            importAccountFromMobileViews: "success",
            importedAccountsFromMobile: importedAccounts as AppDBAccount[]
          }
        });
      } else {
        navigate(ROUTES.ACCOUNT.IMPORT.PERA_SYNC.SUCCESS.FULL_PATH, {
          state: {
            importedAccounts,
            allAccountsImported: mobileAccounts.length === importedAccounts.length
          }
        });
      }
    }
  }

  async function handleImportAccounts(
    mobileAccounts: MobileSyncAccount[]
  ): Promise<AppDBAccount[]> {
    const webAccountAddresses = Object.keys(webAccounts);
    const importedAccounts = [] as AppDBAccount[];

    for (const account of mobileAccounts) {
      const privateKey = isARCStandardMobileSyncAccount(account)
        ? base64ToUint8Array(account.private_key)
        : stringBytesToUint8Array(account.private_key);
      const {addr: address, sk} = deriveAccountFromPrivateKey(privateKey);
      let dbAccount: AppDBAccount | null = null;

      try {
        const pk = await encryptSK(sk, masterkey!);

        // TODO: be careful about rekeyed accounts here
        dbAccount = {
          name: account.name,
          pk,
          address,
          date: new Date()
        } as AppDBAccount;
      } catch (error) {
        console.error("Key Derivation Error");
      }

      if (dbAccount && !webAccountAddresses.includes(address)) {
        try {
          await appDBManager.set("accounts", masterkey!)(address, dbAccount);

          if (!hasAccounts) {
            dispatchAppState({type: "SET_HAS_ACCOUNTS", hasAccounts: true});
          }

          importedAccounts.push(dbAccount);
        } catch (error) {
          console.error("DB Error");
        }
      }
    }

    return importedAccounts;
  }

  function handleCompleteExportAccounts() {
    navigate(ROUTES.OVERVIEW.ROUTE);
  }
}

export default AccountQRCodeSync;
