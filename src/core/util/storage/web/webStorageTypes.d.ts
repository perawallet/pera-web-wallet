type WebStorageStoredValue = null | string | boolean | {[x: string]: any};

type AppTheme = "system" | "light" | "dark";

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
  source: string;
  image: string;
}

type AlgodAccountInformation = {
  address: string;
  amount: number;
  "min-balance": number;
  "auth-addr": string; // rekeyed_to
};

type AccountDetail = {
  rekeyed_to: null | string;
  name: null | AccountDomain;
  minimum_balance: number;
};

type AccountType = "standard" | "ledger" | "watch";

interface AccountOverview extends AppDBAccount, Omit<AccountDetail, "name"> {
  total_usd_value: string;
  total_algo_value: string;
  standard_asset_count: number;
  collectible_count: number;
  rekeyed_to: string | null;

  // renamed bcs of the "name" conflict between account name
  domainName: AccountDomain | null;
}

interface PortfolioOverview {
  current_round: null | number;
  accounts: Record<string, AccountOverview>;
}

type CommonAppState = {
  theme: AppTheme;
  hashedMasterkey: string;
  preferredNetwork: NetworkToggle;
};
