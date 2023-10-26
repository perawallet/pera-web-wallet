import {ApiConfigType} from "../../../api";
import {FetcherConfig} from "../../../network/fetcherTypes";
import {isProductionBuild} from "../../environment/environmentConstants";

const PERA_API_DEFAULT_OPTIONS: Omit<FetcherConfig, "baseUrl"> = {
  initOptions: {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-Key": isProductionBuild
        ? "xxx"
        : "yyy"
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

// eslint-disable-next-line no-useless-escape
const PERA_NFDOMAINS_RGX = /^([a-z0-9\-]+\.){0,1}([a-z0-9\-]+)(\.[a-z0-9]+)$/;

const PERA_ASSETS_ENDPOINT_PAGINATION_LIMIT = 100;

export {
  PERA_API_CONFIG,
  PERA_WEB_DEVICE_CONFIG,
  PERA_NFDOMAINS_RGX,
  PERA_ASSETS_ENDPOINT_PAGINATION_LIMIT
};
