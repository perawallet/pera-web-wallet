type NetworkToggle = "testnet" | "mainnet";

interface AppDBAccount {
  // must properties
  name: string;
  address: string;
  date: Date | null;

  // Ledger Only
  bip32?: string;
  usbOnly?: boolean;

  pk?: string;
}

interface AppDBSession {
  title: string;
  description?: string;
  url: string;
  accountAddresses: string[];
  date: Date;
  favicon?: string;
  chainId?: number;
  network: NetworkToggle;
}

type AppSession = Omit<AppDBSession, "accountAddresses" | "date">;

type AppDBTables = {
  sessions: Record<string, AppDBSession>;
  accounts: Record<string, AppDBAccount>;
};

type AssetDBScheme = {
  // assets table keyPath is composite key `${accountAddress},${assetId}`
  assets: Record<`${string},${number}`, AccountASA>;
  assets_testnet: Record<`${string},${number}`, AccountASA>;
};

interface AppDBPortfolioPosition {
  name: string;
  asset_id: string;
  subtitle: string;
  rows: {
    first_line_name: string;
    first_line_value_in_usd: string;
    second_line_name: string;
    second_line_value: string;
  };
  logo?: string;
}

type AppDBScheme = AppDBTables;
