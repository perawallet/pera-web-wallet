import {peraApi} from "../pera/api/peraApi";

// TODO: remove this if all details can be seen via pera-explorer
function generateAlgoExplorerLink(
  type: "group-id" | "txn-id" | "account-detail" | "asset-detail",
  id: string
): string {
  let baseURL = `https://testnet.algoexplorer.io/`;

  if (peraApi.network === "mainnet") {
    baseURL = baseURL.replace("testnet.", "");
  }

  switch (type) {
    case "txn-id":
      baseURL = `${baseURL}/tx/${encodeURIComponent(id)}`;
      break;

    case "group-id":
      baseURL = `${baseURL}/tx/group/${encodeURIComponent(id)}`;
      break;

    case "account-detail":
      baseURL = `${baseURL}/address/${encodeURIComponent(id)}`;
      break;

    case "asset-detail":
      baseURL = `${baseURL}/asset/${encodeURIComponent(id)}`;
      break;

    default:
      break;
  }

  return baseURL;
}

export {generateAlgoExplorerLink};
