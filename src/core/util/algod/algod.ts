import algosdk from "algosdk";

import {isProductionBuild} from "../environment/environmentConstants";
import {DEFAULT_ALGORAND_NODE_PROVIDER_TYPE} from "./algodConstants";
import {AlgorandNodeProviderType} from "./algodTypes";
import {getAlgosdkCredentialsForNetwork} from "./algodUtils";

class AlgodManager {
  client: algosdk.Algodv2;
  indexer: algosdk.Indexer;
  providerType: AlgorandNodeProviderType;

  constructor({
    network,
    providerType
  }: {
    network: NetworkToggle;
    providerType: AlgorandNodeProviderType;
    shouldCheckTransactionFee?: boolean;
  }) {
    const algosdkCredentials = getAlgosdkCredentialsForNetwork(network, providerType);

    this.providerType = providerType;
    this.client = new algosdk.Algodv2(
      algosdkCredentials.tokens.client,
      algosdkCredentials.server.client,
      algosdkCredentials.port
    );
    this.indexer = new algosdk.Indexer(
      algosdkCredentials.tokens.indexer,
      algosdkCredentials.server.indexer,
      algosdkCredentials.port
    );
  }

  updateClient(network: NetworkToggle, providerType: AlgorandNodeProviderType) {
    const algosdkCredentials = getAlgosdkCredentialsForNetwork(network, providerType);

    this.providerType = providerType;
    this.client = new algosdk.Algodv2(
      algosdkCredentials.tokens.client,
      algosdkCredentials.server.client,
      algosdkCredentials.port
    );

    this.indexer = new algosdk.Indexer(
      algosdkCredentials.tokens.indexer,
      algosdkCredentials.server.indexer,
      algosdkCredentials.port
    );
  }
}

const algod = new AlgodManager({
  network: isProductionBuild ? "mainnet" : "testnet",
  providerType: DEFAULT_ALGORAND_NODE_PROVIDER_TYPE
});

export default algod;
export {AlgodManager};
