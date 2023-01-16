import ALGOD_CREDENTIALS, {
  MAINNET_NODE_CHAIN_ID,
  TESTNET_NODE_CHAIN_ID
} from "./algodConstants";
import {AlgorandNodeProviderType} from "./algodTypes";

function getAlgosdkCredentialsForNetwork(
  network: NetworkToggle,
  credentialType: AlgorandNodeProviderType
) {
  const {mainnet: mainnetCredentials, testnet: testnetCredentials} = ALGOD_CREDENTIALS;
  const preferredNetworkCredentials =
    network === "mainnet" ? mainnetCredentials : testnetCredentials;

  return {
    tokens: {
      client: preferredNetworkCredentials[credentialType].clientToken,
      indexer: preferredNetworkCredentials[credentialType].indexerToken
    },
    server: {
      client: preferredNetworkCredentials[credentialType].clientServer,
      indexer: preferredNetworkCredentials[credentialType].indexerServer
    },
    port: preferredNetworkCredentials[credentialType].port
  };
}

function getChainIdForNetwork(network: NetworkToggle): number {
  if (network === "mainnet") {
    return MAINNET_NODE_CHAIN_ID;
  }

  return TESTNET_NODE_CHAIN_ID;
}

export {getAlgosdkCredentialsForNetwork, getChainIdForNetwork};
