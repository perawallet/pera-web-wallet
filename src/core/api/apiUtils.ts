import {assetDBManager} from "../app/db";
import algod from "../util/algod/algod";
import {DEFAULT_ALGORAND_NODE_PROVIDER_TYPE} from "../util/algod/algodConstants";
import {peraApi} from "../util/pera/api/peraApi";

function updateAPIsPreferredNetwork(network: NetworkToggle) {
  algod.updateClient(network, DEFAULT_ALGORAND_NODE_PROVIDER_TYPE);
  peraApi.updateNetwork(network);
  assetDBManager.updateTable(network);
}

export {updateAPIsPreferredNetwork};
