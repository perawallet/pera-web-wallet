import {getDefaultTheme} from "../../../app/util/appStateUtils";
import {stringToUint8Array, uint8ArrayToString} from "../../blob/blobUtils";
import {decryptSK, encryptSK} from "../../nacl/naclUtils";
import webStorage, {STORED_KEYS} from "./webStorage";

type EncryptedWebStorageKey = ValueOf<
  Pick<
    typeof STORED_KEYS,
    "DEVICE_INFO" | "STALE_PORTFOLIO_OVERVIEW" | "BACKUP_PASSPHRASE"
  >
>;

function encryptedWebStorageUtils(encryptionKey: string) {
  return {
    async get(storedKey: EncryptedWebStorageKey) {
      const encryptedContent = webStorage.local.getItem(storedKey);

      if (!encryptedContent) return null;

      const decryptedContent = await decryptSK(encryptedContent as string, encryptionKey);

      return JSON.parse(uint8ArrayToString(decryptedContent));
    },
    async set(storedKey: EncryptedWebStorageKey, value: unknown): Promise<void> {
      const encryptedContent = await encryptSK(
        stringToUint8Array(JSON.stringify(value)),
        encryptionKey
      );

      webStorage.local.setItem(storedKey, encryptedContent);
    }
  };
}

function getCommonAppState() {
  const {PREFERRED_NETWORK, HASHED_MASTERKEY} = STORED_KEYS;

  const [preferredNetwork, hashedMasterkey] = [PREFERRED_NETWORK, HASHED_MASTERKEY].map(
    (storedKey) => webStorage.local.getItem(storedKey)
  );

  return {
    theme: getDefaultTheme(),
    preferredNetwork,
    hashedMasterkey
  } as CommonAppState;
}

export {encryptedWebStorageUtils, getCommonAppState};
