export type AccountASA = Omit<
  Asset,
  "creator" | "explorer_url" | "is_verified" | "usd_value" | "total"
> & {
  address: string;
  amount: string;
  balance_usd_value: string;
};

export interface CurrencyInformation {
  currency_id: string;
  name: string;
  symbol: string;
  usd_value: number;
  exchange_price: string;
  last_updated_at: string;
  s: string;
  last_24_hours_price_change_percentage: number;
}

export interface MultipleAccountOverviewRequestBody {
  account_addresses: string[];
  last_known_round?: string;
  exclude_opt_ins?: boolean;
}

export interface ShouldRefreshRequestBody {
  account_addresses: string[];
  last_refreshed_round: null | number;
}

export interface ShouldRefreshRequestResponse {
  refresh: boolean;
  round: number;
}

export interface DeviceInformation {
  id: string;
  accounts: {
    address: string;
    is_watch_account: boolean;
    receive_notifications: boolean;
  }[];
  auth_token: string;
  push_token: string;
  app_version: string;
}

export interface AccountNameService {
  name: string;
  address: string;
  service: {name: string; logo: string};
}

export interface BannerInformation {
  id: number;
  type: "generic" | "governance";
  title: string;
  subtitle: string;
  button_label: string;
  button_web_url: string;
}

export interface BannerResponse {
  results: BannerInformation[];
}
