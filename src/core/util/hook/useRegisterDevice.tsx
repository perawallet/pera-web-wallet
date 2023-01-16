import {useEffect, useMemo, useRef} from "react";

import {useAppContext} from "../../app/AppContext";
import {PeraApi, peraApi} from "../pera/api/peraApi";
import {PERA_API_CONFIG} from "../pera/api/peraApiConstants";
import {DeviceInformation} from "../pera/api/peraApiModels";
import webStorage, {STORED_KEYS} from "../storage/web/webStorage";
import {encryptedWebStorageUtils} from "../storage/web/webStorageUtils";

function useRegisterDevice() {
  const registerDeviceRef = useRef<boolean>(false);
  const updateDeviceRef = useRef<boolean>(false);
  const {
    state: {masterkey, accounts, preferredNetwork},
    dispatch: dispatchAppState
  } = useAppContext();
  const userAccountsRef = useRef<number>(accounts ? Object.keys(accounts).length : 0);
  const toggledNetwork = preferredNetwork === "mainnet" ? "testnet" : "mainnet";
  const toggledNetworkApi = useMemo(
    () => new PeraApi(PERA_API_CONFIG, toggledNetwork),
    [toggledNetwork]
  );
  const {mainnetApi, testnetApi} = {
    mainnetApi: preferredNetwork === "mainnet" ? peraApi : toggledNetworkApi,
    testnetApi: preferredNetwork === "mainnet" ? toggledNetworkApi : peraApi
  };

  // register device for testnet/mainnet
  // it is triggered first when user creates passcode
  useEffect(() => {
    const isDeviceInfoExist = Boolean(webStorage.local.getItem(STORED_KEYS.DEVICE_INFO));

    (async () => {
      if (isDeviceInfoExist || !masterkey) return;

      try {
        const [
          {id: deviceIdMainnet, auth_token: authTokenMainnet},
          {id: deviceIdTestnet, auth_token: authTokenTestnet}
        ] = await Promise.all([mainnetApi.registerDevice(), testnetApi.registerDevice()]);

        const device = {
          mainnet: {deviceId: deviceIdMainnet, token: authTokenMainnet},
          testnet: {deviceId: deviceIdTestnet, token: authTokenTestnet}
        };

        await encryptedWebStorageUtils(masterkey).set(STORED_KEYS.DEVICE_INFO, device);

        registerDeviceRef.current = true;
      } catch (error) {
        console.error(error);
      }
    })();
  }, [
    dispatchAppState,
    mainnetApi,
    masterkey,
    preferredNetwork,
    testnetApi,
    toggledNetwork
  ]);

  // update device info for testnet/mainnet
  // needed for BE purposes
  useEffect(() => {
    (async () => {
      let shouldSkipUpdate =
        updateDeviceRef.current || registerDeviceRef.current || !masterkey;
      const userAccountCount = accounts ? Object.keys(accounts).length : 0;

      if (userAccountsRef.current !== userAccountCount) {
        shouldSkipUpdate = false;

        userAccountsRef.current = userAccountCount;
      }

      if (shouldSkipUpdate || !masterkey) return;

      try {
        const deviceInfo = (await encryptedWebStorageUtils(masterkey).get(
          STORED_KEYS.DEVICE_INFO
        )) as DeviceInfo;

        if (!deviceInfo || !accounts) return;

        const {
          mainnet: {token: tokenMainnet},
          testnet: {token: tokenTestnet}
        } = deviceInfo;
        const deviceAccounts: DeviceInformation["accounts"] = Object.values(accounts).map(
          (account) => ({
            address: account.address,
            is_watch_account: false,
            receive_notifications: false
          })
        );

        if (deviceAccounts.length > 0) {
          Promise.all([
            mainnetApi.updateDevice({
              accounts: deviceAccounts,
              authToken: tokenMainnet
            }),
            testnetApi.updateDevice({
              accounts: deviceAccounts,
              authToken: tokenTestnet
            })
          ]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        // in case of error, try next cold start
        updateDeviceRef.current = true;
      }
    })();
  }, [accounts, mainnetApi, masterkey, preferredNetwork, testnetApi]);
}

export default useRegisterDevice;
