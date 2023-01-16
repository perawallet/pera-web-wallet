import algosdk, {Transaction} from "algosdk";
import {createContext, useContext} from "react";

import useFormito from "../../core/util/hook/formito/useFormito";
import useLocationWithState from "../../core/util/hook/useLocationWithState";
import {AccountASA} from "../../core/util/pera/api/peraApiModels";
import {usePortfolioContext} from "../../overview/context/PortfolioOverviewContext";
import PeraLoader from "../../component/loader/pera/PeraLoader";
import webStorage, {STORED_KEYS} from "../../core/util/storage/web/webStorage";
import {getHighestBalanceAccount} from "../../account/util/accountUtils";

export interface SendTxnFlowState {
  // Form related values
  senderAddress?: string;
  selectedAsset?: AccountASA;
  recipientAddress?: string;
  txnAmount?: string;
  txnNote: string;
  txnFee: number;

  // Txn related values
  exchangePrice?: number;
  txnToSign?: Transaction;

  minBalance?: number;
  hideSendTxnInfoModal: boolean;
}

export const initialSendTxnFlowState = {
  recipientAddress: "",
  txnFee: algosdk.ALGORAND_MIN_TX_FEE,
  txnNote: ""
};

const SendTxnFlowContext = createContext(
  {} as ReturnType<typeof useFormito<SendTxnFlowState>>
);

type LocationState = {address: AccountOverview["address"]};

function SendTxnFlowContextProvider({children}: {children: React.ReactNode}) {
  const portfolioOverview = usePortfolioContext();
  const {address: prefilledAccountAddress} = useLocationWithState<LocationState>();

  if (!portfolioOverview) {
    return <PeraLoader mode={"gray"} customClassName={"pera-loader--align-center"} />;
  }

  const {portfolio_value_usd, portfolio_value_algo} = portfolioOverview;
  const senderAddress =
    prefilledAccountAddress ||
    // it returns undefined if there is no account in portfolio
    getHighestBalanceAccount(portfolioOverview.accounts)?.address;

  const initialState: SendTxnFlowState = {
    ...initialSendTxnFlowState,
    senderAddress,
    exchangePrice:
      Number(portfolio_value_usd) /
      algosdk.microalgosToAlgos(Number(portfolio_value_algo)),
    hideSendTxnInfoModal: !!webStorage.local.getItem(STORED_KEYS.HIDE_SEND_TXN_INFO_MODAL)
  };

  return (
    <SendTxnFlowFormitoContainer state={initialState}>
      {children}
    </SendTxnFlowFormitoContainer>
  );
}

function SendTxnFlowFormitoContainer({
  state,
  children
}: {
  state: SendTxnFlowState;
  children: React.ReactNode;
}) {
  const {formitoState, dispatchFormitoAction} = useFormito<SendTxnFlowState>(state);

  return (
    <SendTxnFlowContext.Provider value={{formitoState, dispatchFormitoAction}}>
      {children}
    </SendTxnFlowContext.Provider>
  );
}

function useSendTxnFlowContext() {
  return useContext(SendTxnFlowContext);
}

export default SendTxnFlowContextProvider;
export {useSendTxnFlowContext};
