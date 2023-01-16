import {ApiConfigType} from "../../../api";
import {FetcherConfig} from "../../../network/fetcherTypes";
import {isProductionBuild} from "../../environment/environmentConstants";

const PERA_API_DEFAULT_OPTIONS: Omit<FetcherConfig, "baseUrl"> = {
  initOptions: {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-Key": isProductionBuild
        ? "pera-web-Dr98Vnmu-0yFejf-G-A1M7-7cZS6P0d-"
        : "pera-web-staging-U-jZ3m-LR6-ed-7fLTmekDl0-95N5jUX"
    }
  },
  bodyParser: JSON.stringify
};

const PERA_API_BASE_URL: Record<NetworkToggle, string> = {
  mainnet: `https://mainnet.${isProductionBuild ? "" : "staging."}api.perawallet.app/`,
  testnet: `https://testnet.${isProductionBuild ? "" : "staging."}api.perawallet.app/`
};

const PERA_API_CONFIG: ApiConfigType = {
  mainnet: {
    baseUrl: PERA_API_BASE_URL.mainnet,
    ...PERA_API_DEFAULT_OPTIONS
  },
  testnet: {
    baseUrl: PERA_API_BASE_URL.testnet,
    ...PERA_API_DEFAULT_OPTIONS
  }
};

const PERA_WEB_DEVICE_CONFIG = {
  platform: "web",
  application: "pera",
  locale: "en"
};

export {PERA_API_CONFIG, PERA_WEB_DEVICE_CONFIG};
