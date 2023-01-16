import {AlgodCredentials, AlgorandNodeProviderType} from "./algodTypes";

export const DEFAULT_ALGORAND_NODE_PROVIDER_TYPE: AlgorandNodeProviderType = "algodev";
export const MAINNET_NODE_CHAIN_ID = 416001;
export const TESTNET_NODE_CHAIN_ID = 416002;
export const GENESIS_HASH_BY_NETWORK: Record<NetworkToggle, string> = {
  mainnet: "wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=",
  testnet: "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="
} as const;
export const NETWORK_MISMATCH_MESSAGE =
  "Your wallet is connected to a different network to this dApp. Update your wallet to the correct network (MainNet or TestNet) to continue.";

const ALGOD_CREDENTIALS: AlgodCredentials = {
  mainnet: {
    algodev: {
      clientToken: process.env.REACT_APP_ALGOD_TOKEN,
      clientServer: "https://node-mainnet.chain.perawallet.app/",
      indexerToken: process.env.REACT_APP_INDEXER_TOKEN,
      indexerServer: "https://indexer-mainnet.chain.perawallet.app/",
      port: 443,
      chainId: MAINNET_NODE_CHAIN_ID
    }
  },
  testnet: {
    algodev: {
      clientToken: process.env.REACT_APP_ALGOD_TOKEN,
      clientServer: "https://node-testnet.chain.perawallet.app/",
      indexerToken: process.env.REACT_APP_INDEXER_TOKEN,
      indexerServer: "https://indexer-testnet.chain.perawallet.app/",
      port: 443,
      chainId: TESTNET_NODE_CHAIN_ID
    }
  }
};

export default ALGOD_CREDENTIALS;
