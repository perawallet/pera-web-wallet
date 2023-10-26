import {AlgodCredentials, AlgorandNodeProviderType} from "./algodTypes";

export const DEFAULT_ALGORAND_NODE_PROVIDER_TYPE: AlgorandNodeProviderType = "algodev";
export const MAINNET_NODE_CHAIN_ID = 416001;
export const TESTNET_NODE_CHAIN_ID = 416002;
export const BETANET_NODE_CHAIN_ID = 416003;
export const ALGORAND_NODE_CHAIN_ID = 4160;
export const DEFAULT_ALGORAND_CLIENT_PORT = 443;
export const GENESIS_HASH_BY_NETWORK: Record<NetworkToggle, string> = {
  mainnet: "wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=",
  testnet: "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="
} as const;

export const CHAIN_ID_BY_NETWORK = {
  mainnet: MAINNET_NODE_CHAIN_ID,
  testnet: TESTNET_NODE_CHAIN_ID,
  betanet: BETANET_NODE_CHAIN_ID,
  // it is assumed as mainnet
  algorand: ALGORAND_NODE_CHAIN_ID
} as const;
export const NETWORK_MISMATCH_MESSAGE =
  "Your wallet is connected to a different network to this dApp. Update your wallet to the correct network (MainNet or TestNet) to continue.";

const COMMON_ALGOD_CREDENTIALS = {
  clientToken: process.env.REACT_APP_ALGOD_CLIENT_TOKEN!,
  indexerToken: process.env.REACT_APP_ALGOD_INDEXER_TOKEN!,
  port: DEFAULT_ALGORAND_CLIENT_PORT
};
const ALGOD_CREDENTIALS: AlgodCredentials = {
  mainnet: {
    algodev: {
      ...COMMON_ALGOD_CREDENTIALS,
      clientServer: "https://node-mainnet.chain.perawallet.app/",
      indexerServer: "https://indexer-mainnet.chain.perawallet.app/",
      chainId: MAINNET_NODE_CHAIN_ID
    }
  },
  testnet: {
    algodev: {
      ...COMMON_ALGOD_CREDENTIALS,
      clientServer: "https://node-testnet.chain.perawallet.app/",
      indexerServer: "https://indexer-testnet.chain.perawallet.app/",
      chainId: TESTNET_NODE_CHAIN_ID
    }
  }
};

export default ALGOD_CREDENTIALS;
