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
}

export interface FetchMoonPayURLPayload {
  wallet_address: string;
  redirect_url: string;
  email?: string;
  lock_amount?: string;
}

export interface MultipleAccountOverviewRequestBody {
  account_addresses: string[];
  last_known_round?: string;
  exclude_opt_ins?: boolean;
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
