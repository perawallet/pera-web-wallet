export type AlgorandNodeProviderType = "algodev";

export type AlgodCredentialShape = Record<
  AlgorandNodeProviderType,
  Readonly<{
    clientToken: string;
    clientServer: string;
    indexerToken: string;
    indexerServer: string;
    port: number;
    chainId?: number;
  }>
>;

export interface AlgorandNodeProvider {
  type: AlgorandNodeProviderType;
  isHealthy: boolean;
  title: string;
}

export interface AlgodCredentials {
  mainnet: AlgodCredentialShape;
  testnet: AlgodCredentialShape;
}

export type NetworkToggle = "testnet" | "mainnet";
