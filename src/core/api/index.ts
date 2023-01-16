import Fetcher from "../network/Fetcher";
import {FetcherConfig} from "../network/fetcherTypes";
import {isProductionBuild} from "../util/environment/environmentConstants";

export const DEFAULT_API_NETWORK: NetworkToggle = isProductionBuild
  ? "mainnet"
  : "testnet";

export type ApiConfigType = Record<NetworkToggle, FetcherConfig>;

class Api<ConfigType extends ApiConfigType> {
  #apiConfig: ConfigType;
  #network: NetworkToggle;
  #instance: Fetcher | undefined;

  constructor(config: ConfigType, network: NetworkToggle = DEFAULT_API_NETWORK) {
    this.#apiConfig = config;
    this.#network = network;
    this.#instance = this.createApiInstance();
  }

  private createApiInstance() {
    return new Fetcher(this.#apiConfig[this.#network]);
  }

  getInstance() {
    if (!this.#instance) {
      this.#instance = this.createApiInstance();
    }
    return this.#instance;
  }

  get network() {
    return this.#network;
  }

  updateNetwork(network: NetworkToggle) {
    this.#instance = undefined;
    this.#network = network;
  }
}

export default Api;
