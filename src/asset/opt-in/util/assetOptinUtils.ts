import algosdk, {Transaction} from "algosdk";

import algod from "../../../core/util/algod/algod";

async function generateAssetOptinTxn(
  accountAddress: string,
  assetId: number
): Promise<Transaction> {
  const suggestedParams = await algod.client.getTransactionParams().do();

  return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: accountAddress,
    to: accountAddress,
    assetIndex: assetId,
    amount: 0,
    suggestedParams
  });
}

export {generateAssetOptinTxn};
