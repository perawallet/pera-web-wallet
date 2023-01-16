import {AccountBackup} from "../../../../account/accountModels";
import {PortfolioOverview} from "../../../../overview/util/hook/usePortfolioOverview";
import Api, {ApiConfigType, DEFAULT_API_NETWORK} from "../../../api";
import {fetchJSONMiddleware} from "../../../network/fetcherUtils";
import {PERA_API_CONFIG, PERA_WEB_DEVICE_CONFIG} from "./peraApiConstants";
import {
  AccountASA,
  CurrencyInformation,
  DeviceInformation,
  FetchMoonPayURLPayload,
  MultipleAccountOverviewRequestBody
} from "./peraApiModels";
import {mapAddressAccountASADataMiddleware} from "./peraApiUtils";

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
      {
        method: "GET"
      },
      `v1/backups/${deviceId}/`
    );
  }

  getAssets(params: ListAssetRequestParams) {
    return this.getInstance().run<ListRequestResponse<Asset>>(
      {
        method: "GET",
        params
      },
      `v1/assets/`
    );
  }

  getAccountOverview(address: string) {
    return this.getInstance().run<AccountOverview>(
      {
        method: "GET"
      },
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

  fetchMoonPayURL(body: FetchMoonPayURLPayload) {
    return this.getInstance().run<{url: string}>(
      {
        method: "POST",
        body
      },
      "v1/moonpay/sign-url/"
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

  /**
   * Only for Caching Purposes - Do not use directly in components.
   * ---
   * Batches all independent requests for paginated `getAccountAssets` endpoint
   * returns all assets of address given in array
   *
   * @param {string[]} addresses
   * @returns  {Promise<AccountASA[]>}
   * @memberof PeraApi
   */
  getAllMultipleAccountAssets(addresses: string[]): Promise<AccountASA[]> {
    let include_algo = true;
    let nextBatch: {address: string; next?: string}[] = addresses.map((address) => ({
      address
    }));

    const exec = (
      address: string,
      {shouldIncludeAlgo, cursor}: {shouldIncludeAlgo: boolean; cursor?: string}
    ) =>
      this.getAccountAssets(address, {
        include_algo: shouldIncludeAlgo,
        limit: 500,
        ...(cursor ? {cursor} : {})
      });

    return new Promise(async (resolve) => {
      const assets: AccountASA[] = [];

      do {
        const promises: PromiseSettledResult<ListRequestResponse<AccountASA>>[] =
          await Promise.allSettled(
            // eslint-disable-next-line no-loop-func
            nextBatch.map(({address, next}) =>
              exec(address, {shouldIncludeAlgo: include_algo, cursor: next})
            )
          );

        // do not include algo after first batch
        include_algo = false;

        // reset next batch if all promises settled
        nextBatch = [];

        for (const promise of promises) {
          if (
            promise.status === "fulfilled" &&
            promise.value.results &&
            promise.value.results.length > 0
          ) {
            const {results, next} = promise.value;
            const {address} = results[0];

            assets.push(...results);

            if (next) {
              const cursor = new URL(next).searchParams.get("cursor") || undefined;

              nextBatch.push({address, next: cursor});
            }
          }
        }
      } while (nextBatch.length > 0);

      resolve(assets);
    });
  }
}

const peraApi = new PeraApi(PERA_API_CONFIG);

export {peraApi};
