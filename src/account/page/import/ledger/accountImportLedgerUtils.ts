import {UserRefusedOnDevice} from "@ledgerhq/errors";
import AppAlgorand from "@ledgerhq/hw-app-algorand";
import Transport from "@ledgerhq/hw-transport";

export type LedgerAccountDetails = Required<Pick<AppDBAccount, "address" | "bip32">>;
export const LEDGER_ALGORAND_APP_ERROR_STATUS_CODE = 28161;

const DEFAULT_LEDGER_ACCOUNT_BATCH_SIZE = 4;

function getLedgerAccountDetails(
  connection: Transport,
  {startIndex = 0, batchSize = DEFAULT_LEDGER_ACCOUNT_BATCH_SIZE}
): Promise<LedgerAccountDetails[]> {
  const appAlgorand = new AppAlgorand(connection);

  return appAlgorand.foreach(
    Array.from(
      {length: batchSize},
      (_, arrayIndex) => `44'/283'/${startIndex + arrayIndex}'/0/0`
    ),
    (bip32: string) => appAlgorand.getAddress(bip32).then((res) => ({...res, bip32}))
  );
}

function generateLedgerToastErrorMessage(error: any): {title: string; detail: string} {
  console.error(error);

  if ((error as any)?.statusCode === LEDGER_ALGORAND_APP_ERROR_STATUS_CODE)
    return {
      title: "Algorand App",
      detail: "Please make sure the Algorand App is open on your Ledger device"
    };

  if (error?.name === new UserRefusedOnDevice().name)
    return {
      title: "Transaction Cancelled",
      detail: "The paired ledger device has cancelled the transaction request."
    };

  return {
    title: "Connection Error",
    detail:
      "Could not reach Ledger device. Please ensure Ledger device is on and unlocked"
  };
}

export {getLedgerAccountDetails, generateLedgerToastErrorMessage};
