import {algosToMicroalgos} from "algosdk";

import {trimAccountAddress} from "../../account/util/accountUtils";
import {assetDBManager} from "../../core/app/db";
import {peraApi} from "../../core/util/pera/api/peraApi";
import {
  AccountASA,
  ShouldRefreshRequestResponse
} from "../../core/util/pera/api/peraApiModels";
import algod from "../../core/util/algod/algod";

function mapNewlyCreatedUserAccounts({
  accounts,
  overview
}: {
  accounts: AppDBScheme["accounts"];
  overview?: PortfolioOverview;
}): PortfolioOverview | undefined {
  if (!overview) return undefined;

  const defaultAccounts = Object.fromEntries(
    Object.values(accounts).map((account) => [
      account.address,
      {
        ...account,
        rekeyed_to: null,
        collectible_count: 0,
        standard_asset_count: 1,
        total_algo_value: "0.00",
        total_usd_value: "0.00",
        minimum_balance: 0,
        domainName: null
      } as AccountOverview
    ])
  );

  const {accounts: overviewAccounts} = overview;

  return {
    ...overview,
    accounts: {...defaultAccounts, ...overviewAccounts}
  };
}

function mapAccountOverviewData({
  accountData,
  algoPrice,
  accounts
}: {
  algoPrice: number;
  accountData: [
    AccountASA[],
    Omit<AccountDetail, "min_balance"> & {"min-balance": number}
  ];
  accounts: AppDBScheme["accounts"];
}): AccountOverview {
  const [assets, accountDetail] = accountData;
  let algoAmount = "0.00",
    totalUsdValue = 0,
    standardAssetCount = 0;

  // remove legacy rekeyedTo field if exist
  const {rekeyedTo, ...foundAppDBAccount} = (accounts[assets[0].address] ||
    {}) as AppDBAccount & {
    rekeyedTo?: string;
  };

  for (const asset of assets) {
    // if (asset.type !== "dapp_asset") totalUsdValue += Number(asset.balance_usd_value);
    // TODO: replace this with portfolio feature
    totalUsdValue += Number(asset.balance_usd_value);

    if (asset.type === "algo") algoAmount = asset.amount;

    if (asset.type !== "collectible") standardAssetCount += 1;
  }

  const {name: domainName} = accountDetail;
  const accountDetailRest = Object.assign({}, ...Object.values(accountDetail));

  return {
    ...foundAppDBAccount,
    ...accountDetailRest,
    domainName,

    minimum_balance: accountDetailRest["min-balance"],
    rekeyed_to: accountDetailRest["auth-addr"],
    total_usd_value: String(totalUsdValue),
    total_algo_value:
      peraApi.network === "mainnet"
        ? String(algosToMicroalgos(totalUsdValue / algoPrice))
        : algoAmount,
    standard_asset_count: standardAssetCount,
    collectible_count: assets.length - standardAssetCount
  };
}

function fetchAccountData(addresses: string[], signal: AbortSignal) {
  return addresses.map((address) => {
    const assets = peraApi.getAllAccountAssets(address);
    const accountInfo = algod.client.accountInformation(address).do() as Promise<
      Pick<AlgodAccountInformation, "min-balance" | "auth-addr">
    >;
    const accountNames = peraApi.getAccountNames(address, {signal});
    const accountDetail = Promise.all([accountInfo, accountNames]) as unknown as Promise<
      AccountDetail & AlgodAccountInformation
    >;

    return Promise.all([assets, accountDetail]);
  });
}

async function getPortfolioOverviewData({
  addresses,
  algoPrice,
  shouldRefresh,
  abortSignal,
  accounts
}: {
  addresses: string[];
  algoPrice: number;
  shouldRefresh?: Partial<ShouldRefreshRequestResponse>;
  abortSignal: AbortSignal;
  accounts: AppDBScheme["accounts"];
}) {
  const promises = fetchAccountData(addresses, abortSignal);
  const allAccountData = await Promise.all(promises);
  const accountsOverview: PortfolioOverview["accounts"] = {};
  let totalAlgoValue = 0,
    totalUsdValue = 0;

  const dbEntries: Promise<void>[] = [];

  allAccountData.forEach((accountData) => {
    const [assets] = accountData;
    const accountAddress = assets[0].address;

    const {
      // required params in case of this function used for accounts
      // not included in the wallet
      name = trimAccountAddress(accountAddress),
      address = accountAddress,
      date = new Date(),
      ...overview
    } = mapAccountOverviewData({
      algoPrice,
      accountData,
      accounts
    });

    totalAlgoValue += Number(overview.total_algo_value);
    totalUsdValue += Number(overview.total_usd_value);

    accountsOverview[assets[0].address] = {
      name,
      address,
      date,
      ...overview
    };

    dbEntries.push(
      assetDBManager.setAllAssets()(assets)
    );
  });

  await Promise.all(dbEntries);

  return {
    accounts: accountsOverview,
    current_round: shouldRefresh?.round || null,
    portfolio_value_algo: String(totalAlgoValue),
    portfolio_value_usd: String(totalUsdValue)
  };
}

export {
  mapNewlyCreatedUserAccounts,
  mapAccountOverviewData,
  fetchAccountData,
  getPortfolioOverviewData
};
