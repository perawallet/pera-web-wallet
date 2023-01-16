type NetworkToggle = "testnet" | "mainnet";

type AccountType = "standard" | "ledger";

interface AppDBAccount {
  type?: "standard" | "ledger";
  name: string;
  address: string;
  pk: string;
  date: Date | null;
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

type AppDBScheme = AppDBTables;
