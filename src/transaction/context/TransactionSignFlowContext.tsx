import {Asset as AlgoSDKAsset} from "algosdk/dist/types/src/client/v2/algod/models/types";
import {createContext, useContext} from "react";

import useFormito from "../../core/util/hook/formito/useFormito";
import {SignerTransaction} from "../../core/util/model/peraWalletModel";

type TransactionSignBoxViews =
  | "default"
  | "txn-detail-summary"
  | "txn-detail-single"
  | "raw-txn";

export type TransactionSignFlowState = {
  hasMessageReceived: boolean;
  messageOrigin: string;
  isSignStarted: boolean;
  txns: SignerTransaction[];
  currentSession: AppDBSession | null;
  userAddress: string;
  userAccountName: string;
  transactionAssets: Asset[] | null;
  transactionAssetsFromNode: AlgoSDKAsset[] | null;
  transactionSignView: TransactionSignBoxViews;
  activeTransactionIndex: number;
  authAddresses: string[];
};

export const initialTransactionSignFlowState = {
  hasMessageReceived: false,
  messageOrigin: "",
  isSignStarted: false,
  txns: [],
  currentSession: null,
  userAddress: "",
  userAccountName: "",
  transactionAssets: null,
  transactionAssetsFromNode: null,
  transactionSignView: "default" as TransactionSignBoxViews,
  activeTransactionIndex: 0,
  authAddresses: []
};

const TransactionSignFlowContext = createContext(
  {} as ReturnType<typeof useFormito<TransactionSignFlowState>>
);

function TransactionSignFlowContextProvider({children}: {children: React.ReactNode}) {
  const {formitoState, dispatchFormitoAction} = useFormito<TransactionSignFlowState>(
    initialTransactionSignFlowState
  );

  return (
    <TransactionSignFlowContext.Provider value={{formitoState, dispatchFormitoAction}}>
      {children}
    </TransactionSignFlowContext.Provider>
  );
}

function useTransactionSignFlowContext() {
  return useContext(TransactionSignFlowContext);
}

export default TransactionSignFlowContextProvider;
export {useTransactionSignFlowContext};
