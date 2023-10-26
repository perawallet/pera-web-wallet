import {AccountBackup} from "../../../../account/accountModels";
import Api, {ApiConfigType, DEFAULT_API_NETWORK} from "../../../api";
import {fetchJSONMiddleware} from "../../../network/fetcherUtils";
import {PERA_API_CONFIG, PERA_WEB_DEVICE_CONFIG} from "./peraApiConstants";
import {
  AccountASA,
  AccountNameService,
  BannerResponse,
  CurrencyInformation,
  DeviceInformation,
  MultipleAccountOverviewRequestBody,
  ShouldRefreshRequestBody,
  ShouldRefreshRequestResponse
} from "./peraApiModels";
import {
  filterBannerMiddleware,
  mapAddressAccountASADataMiddleware
} from "./peraApiUtils";

export class PeraApi<ConfigType extends ApiConfigType> extends Api<ConfigType> {
  private config: ConfigType;

  constructor(config: ConfigType, network: NetworkToggle = DEFAULT_API_NETWORK) {
    super(config, network);

    this.config = config;
  }

  registerDevice() {
    return this.getInstance().run<DeviceInformation>(
      {
        method: "POST",
        body: {...PERA_WEB_DEVICE_CONFIG, accounts: []}
      },
      "v2/devices/"
    );
  }

  updateDevice({
    accounts,
    authToken
  }: {
    accounts: DeviceInformation["accounts"];
    authToken: string;
  }) {
    return this.getInstance().run<DeviceInformation>(
      {
        headers: {
          ...(this.config[this.network].initOptions?.headers || {}),
          "x-device-auth-token": authToken
        },
        method: "PUT",
        body: {...PERA_WEB_DEVICE_CONFIG, accounts}
      },
      "v2/devices/me/"
    );
  }

  getBanners(deviceId: string, options?: {signal: AbortSignal}) {
    return this.getInstance().run<BannerResponse>(
      {
        method: "GET",
        responseMiddlewares: [fetchJSONMiddleware, filterBannerMiddleware],
        signal: options?.signal
      },
      `v1/devices/${deviceId}/banners/`
    );
  }

  createAccountBackup(deviceId: string, encryptedContent?: string) {
    const body = {
      type: "temporary",
      creator_device: deviceId
    } as {
      type: "temporary" | "permanent";
      creator_device: string;
      encrypted_content: string;
    };

    if (encryptedContent) {
      body.encrypted_content = encryptedContent;
    }

    return this.getInstance().run<AccountBackup>({method: "POST", body}, "v1/backups/");
  }

  getAccountBackup(deviceId: string) {
    return this.getInstance().run<{encrypted_content: string}>(
      {method: "GET"},
      `v1/backups/${deviceId}/`
    );
  }

  getAssets(params: ListAssetRequestParams, options?: {signal: AbortSignal}) {
    return this.getInstance().run<ListRequestResponse<Asset>>(
      {
        method: "GET",
        params,
        signal: options?.signal
      },
      `v1/assets/`
    );
  }

  getAccountOverview(address: string) {
    return this.getInstance().run<AccountOverview>(
      {method: "GET"},
      `v1/accounts/${address}/overview`
    );
  }

  getMultipleAccountOverview(body: MultipleAccountOverviewRequestBody) {
    return this.getInstance().run<PortfolioOverview>(
      {
        method: "POST",
        body
      },
      "v1/accounts/multiple-overview/"
    );
  }

  getCurrency({currency}: {currency: string}) {
    return this.getInstance().run<CurrencyInformation>(
      {
        method: "GET"
      },
      `v1/currencies/${currency}/`
    );
  }

  getNFDomains(name: string, options?: {signal: AbortSignal}) {
    return this.getInstance().run<ListRequestResponse<AccountNameService>>(
      {
        method: "GET",
        params: {name},
        signal: options?.signal
      },
      `v1/name-services/search/`
    );
  }

  getAccountAssets(
    address: string,
    params?: ListRequestParams & {include_algo: boolean}
  ) {
    return this.getInstance().run<ListRequestResponse<AccountASA>>(
      {
        method: "GET",
        params,
        responseMiddlewares: [
          fetchJSONMiddleware,
          mapAddressAccountASADataMiddleware(address)
        ]
      },
      `v1/accounts/${address}/assets/`
    );
  }

  getAccountDetail(address: string, options?: {signal: AbortSignal}) {
    return this.getInstance().run<AccountDetail>(
      {
        method: "GET",
        signal: options?.signal
      },
      `v1/accounts/${address}/`
    );
  }

  getAccountNames(address: string, options?: {signal: AbortSignal}) {
    return this.getInstance().run<AccountDomain>(
      {method: "GET", signal: options?.signal},
      `v1/accounts/${address}/names/`
    );
  }

  getShouldRefresh(body: ShouldRefreshRequestBody, options?: {signal: AbortSignal}) {
    return this.getInstance().run<ShouldRefreshRequestResponse>(
      {
        method: "POST",
        body,
        signal: options?.signal
      },
      "v1/accounts/should-refresh/"
    );
  }

  /**
   * Only for Caching Purposes - Do not use directly in components.
   * ---
   *
   *
   * Get all assets of an account using a paginated endpoint
   *
   *
   * @param {string} address
   * @throws will reject if one of the prerequisite request fails
   * @memberof PeraApi
   */
  getAllAccountAssets(address: string): Promise<AccountASA[]> {
    let cursor: string | null | undefined;
    let include_algo = true;

    const exec = () =>
      this.getAccountAssets(address, {
        include_algo,
        limit: 2000,
        ...(cursor ? {cursor} : {})
      });

    return new Promise(async (resolve, reject) => {
      const assets: AccountASA[] = [];

      try {
        do {
          const {results, next} = await exec();

          assets.push(...results);

          cursor = next ? new URL(next).searchParams.get("cursor") : null;
          include_algo = false;
        } while (cursor);

        resolve(assets);
      } catch (error) {
        reject(error);
      }
    });
  }
}

const peraApi = new PeraApi(PERA_API_CONFIG);

export {peraApi};
