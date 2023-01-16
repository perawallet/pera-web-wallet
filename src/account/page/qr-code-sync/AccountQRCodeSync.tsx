import "./_account-qr-code-sync.scss";

import nacl from "tweetnacl";
import {List, ListItem} from "@hipo/react-ui-toolkit";
import {useMemo} from "react";
import {Navigate, useLocation} from "react-router-dom";

import PeraQRCode from "../../../component/pera-qr-code/PeraQRCode";
import ROUTES from "../../../core/route/routes";
import useInterval from "../../../core/util/hook/useInterval";
import {peraApi} from "../../../core/util/pera/api/peraApi";
import {
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
import {decryptAccountBackup, encryptSK} from "../../../core/util/nacl/naclUtils";
import {MobileSyncAccount} from "../../accountModels";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import {deriveAccountFromPrivateKey} from "../../util/accountUtils";
import useNavigateFlow from "../../../core/route/navigate/useNavigateFlow";
import {AccountComponentFlows} from "../../util/accountTypes";
import {useConnectFlowContext} from "../../../connect/context/ConnectFlowContext";
import {PortfolioOverview} from "../../../overview/util/hook/usePortfolioOverview";
import {appDBManager} from "../../../core/app/db";

interface AccountQRCodeSyncProps {
  sync: "web-to-mobile" | "mobile-to-web";
  flow?: AccountComponentFlows;
}

type LocationState = {
  state: {modificationKey?: string; backupId?: string};
};

// This component handles both mobile-to-web / web-to-mobile qr-code processes
function AccountQRCodeSync({sync, flow = "default"}: AccountQRCodeSyncProps) {
  // TODO: get searchParams to decide if export or import qr
  const navigate = useNavigateFlow();
  const location = useLocation() as LocationState;
  const {
    state: {accounts: webAccounts, masterkey},
    dispatch: dispatchAppState
  } = useAppContext();
  const simpleToaster = useSimpleToaster();
  const encryptionKey = useMemo(() => nacl.randomBytes(nacl.secretbox.keyLength), []);
  const {formitoState, dispatchFormitoAction} = useConnectFlowContext();

  const isInConnectFlow = flow === "connect";
  const backupId =
    isInConnectFlow && formitoState
      ? formitoState.accountBackup?.backupId
      : location?.state?.backupId;
  const modificationKey = isInConnectFlow
    ? formitoState.accountBackup?.modificationKey
    : location.state.modificationKey;
  const accountBackupState = {modificationKey, backupId};

  const QR_CODE_SYNC_CONTANTS =
    sync === "web-to-mobile"
      ? SYNC_WEB_TO_MOBILE_CONSTANTS
      : SYNC_MOBILE_TO_WEB_CONSTANTS;

  // Polling;
  useInterval(handleAccountBackupPolling, PERA_SYNC_POLLING_INTERVAL, {
    shouldRunCallbackAtStart: true,
    refreshLimit: PERA_SYNC_POLLING_LIMIT
  });

  if (!isInConnectFlow && (!backupId || !modificationKey)) {
    return <Navigate to={ROUTES.ACCOUNT.IMPORT.PERA_SYNC.FULL_PATH} />;
  }

  return (
    <div className={"account-import-pera-qr"}>
      <h1 className={"typography--h2 text-color--main"}>{"Import from Pera Mobile"}</h1>

      <div className={"account-import-pera__qr-code-wrapper"}>
        <PeraQRCode
          value={JSON.stringify({
            ...accountBackupState,
            encryptionKey: encryptionKey.toString()
          })}
        />
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
    </div>
  );

  async function handleAccountBackupPolling() {
    let cipher: string | null = null;

    // encrypted_content: stringified Uint8Array[nonce] + Uint8Array[cipher]
    // nonce: first 24 bytes of the encrypted content
    try {
      const {encrypted_content} = (await peraApi.getAccountBackup(backupId!)) || {};

      cipher = encrypted_content;
    } catch (error) {
      console.error("API Error", error);
      return;
    }

    if (cipher) {
      // nacl returns null in case of decryption error
      const decryptedContent = decryptAccountBackup(cipher, encryptionKey);

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

        if (flow === "connect") {
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

      if (flow === "connect") {
        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {
            importAccountFromMobileViews: "success",
            importedAccountsFromMobile:
              importedAccounts as unknown as PortfolioOverview["accounts"]
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
      const privateKey = stringBytesToUint8Array(account.private_key);
      const {addr: address, sk} = deriveAccountFromPrivateKey(privateKey);
      let dbAccount: AppDBAccount | null = null;

      try {
        const pk = await encryptSK(sk, masterkey!);

        dbAccount = {
          type: "standard",
          name: account.name,
          pk,
          address,
          date: new Date()
        };
      } catch (error) {
        console.error("Key Derivation Error");
      }

      if (dbAccount && !webAccountAddresses.includes(address)) {
        try {
          await appDBManager.set("accounts", masterkey!)(address, dbAccount);

          dispatchAppState({type: "SET_ACCOUNT", account: dbAccount});

          importedAccounts.push(dbAccount);
        } catch (error) {
          console.error("DB Error");
        }
      }
    }

    return importedAccounts;
  }
}

export default AccountQRCodeSync;
