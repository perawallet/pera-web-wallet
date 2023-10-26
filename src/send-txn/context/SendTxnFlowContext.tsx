import algosdk, {Transaction} from "algosdk";
import {createContext, useContext} from "react";

import useFormito from "../../core/util/hook/formito/useFormito";
import useLocationWithState from "../../core/util/hook/useLocationWithState";
import {AccountASA} from "../../core/util/pera/api/peraApiModels";
import {usePortfolioContext} from "../../overview/context/PortfolioOverviewContext";
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
  const portfolioContext = usePortfolioContext();
  const {address: prefilledAccountAddress} = useLocationWithState<LocationState>();

  let initialState: SendTxnFlowState = {
    ...initialSendTxnFlowState,
    senderAddress: "",
    hideSendTxnInfoModal: !!webStorage.local.getItem(STORED_KEYS.HIDE_SEND_TXN_INFO_MODAL)
  };

  if (portfolioContext) {
    const {
      accounts,
      overview: {portfolio_value_algo = "", portfolio_value_usd = ""}
    } = portfolioContext;
    const senderAddress =
      prefilledAccountAddress || getHighestBalanceAccount(accounts)?.address;
    const exchangePrice =
      Number(portfolio_value_usd) /
      algosdk.microalgosToAlgos(Number(portfolio_value_algo));

    initialState = {
      ...initialState,
      senderAddress,
      exchangePrice
    };
  }

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
