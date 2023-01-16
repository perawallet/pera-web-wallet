type WebStorageStoredValue = null | string | boolean | {[x: string]: any};

type DeviceInfo = Record<
  NetworkToggle,
  {
    deviceId: string;
    token: string;
  }
>;

type AppBanner = {
  id: string;
  isClosed: boolean;
};

interface AccountDomain {
  name: string;
  source: "nfdomain" | "peranameservice";
  image: string;
}

interface AccountOverview {
  address: string;
  name: AccountDomain | null;
  total_usd_value: string;
  total_algo_value: string;
  standard_asset_count: number;
  collectible_count: number;
}

interface AppDBOverview {
  current_round: string;
  portfolio_value_usd: string;
  portfolio_value_algo: string;
  accounts: AccountOverview[];
}

type CommonAppState = {
  theme: "system" | "dark" | "light";
  hashedMasterkey: string;
  preferredNetwork: NetworkToggle;
};
