import algosdk from "algosdk";
import {Asset as AlgoSDKAsset} from "algosdk/dist/types/client/v2/algod/models/types";
import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

import useFormito from "../../core/util/hook/formito/useFormito";
import {ArbitraryData, SignerTransaction} from "../../core/util/model/peraWalletModel";
import {useAppContext} from "../../core/app/AppContext";
import appTellerManager, {PeraTeller} from "../../core/app/teller/appTellerManager";
import {base64ToUint8Array} from "../../core/util/blob/blobUtils";
import {checkIfTransactionNetworkIsMatches} from "../utils/transactionUtils";
import useTellerListener from "../../core/util/hook/useTellerListener";
import {
  ALGORAND_NODE_CHAIN_ID,
  CHAIN_ID_BY_NETWORK,
  NETWORK_MISMATCH_MESSAGE
} from "../../core/util/algod/algodConstants";
import {AlgorandChainIDs} from "../../core/util/algod/algodTypes";
import useDBAccounts from "../../core/util/hook/useDBAccounts";
import algod from "../../core/util/algod/algod";

type TransactionSignBoxViews =
  | "default"
  | "txn-detail-summary"
  | "txn-detail-single"
  | "txn-arbitrary-data"
  | "raw-txn";

export type TransactionSignerAccount = AppDBAccount & {rekeyed_to: string | null};

export type TransactionSignFlowState = {
  hasMessageReceived: boolean;
  messageOrigin: string;
  isSignStarted: boolean;
  txns: SignerTransaction[];
  arbitraryData: {
    data: ArbitraryData[];
    signer: string;
    chainId: AlgorandChainIDs;
  } | null;
  hasNetworkMismatch: boolean;
  currentSession: AppDBSession | null;
  signerAccountDetail: AccountDetail | null;
  userAddress: string;
  userAccountName: string;
  transactionAssets: Asset[] | null;
  transactionAssetsFromNode: AlgoSDKAsset[] | null;
  transactionSignView: TransactionSignBoxViews;
  activeTransactionIndex: number;
  authAddresses: string[];
  accounts: Record<string, TransactionSignerAccount>;
};

export const initialTransactionSignFlowState = {
  hasMessageReceived: false,
  hasNetworkMismatch: false,
  messageOrigin: "",
  isSignStarted: false,
  txns: [],
  arbitraryData: null,
  currentSession: null,
  signerAccountDetail: null,
  userAddress: "",
  userAccountName: "",
  transactionAssets: null,
  transactionAssetsFromNode: null,
  transactionSignView: "default" as TransactionSignBoxViews,
  activeTransactionIndex: 0,
  authAddresses: [],
  accounts: {}
};

const TransactionSignFlowContext = createContext(
  {} as ReturnType<typeof useFormito<TransactionSignFlowState>>
);

function TransactionSignFlowContextProvider({children}: {children: React.ReactNode}) {
  const {
    state: {preferredNetwork, masterkey}
  } = useAppContext();
  const {formitoState, dispatchFormitoAction} = useFormito<TransactionSignFlowState>(
    initialTransactionSignFlowState
  );
  const [searchParams] = useSearchParams();
  const isEmbedded = Boolean(searchParams.get("embedded"));
  const [eventDataMessage, setEventDataMessage] = useState<PeraTeller>();
  const dbAccounts = useDBAccounts();

  useEffect(() => {
    if (!masterkey) {
      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {
          accounts: {}
        }
      });
    }
  }, [masterkey, dispatchFormitoAction]);

  useEffect(() => {
    const abortController = new AbortController();

    if (masterkey && dbAccounts) {
      (async () => {
        const algodAccountDetailPromises: Promise<AlgodAccountInformation>[] = [];

        Object.keys(dbAccounts).forEach((address) => {
          algodAccountDetailPromises.push(
            algod.client
              .accountInformation(address)
              .do() as Promise<AlgodAccountInformation>
          );
        });

        const accountsDetail = await Promise.all(algodAccountDetailPromises);

        const mappedAccounts = Object.entries(dbAccounts).reduce(
          (filtered, [key, value], index) => {
            filtered[key] = {...value, rekeyed_to: accountsDetail[index]["auth-addr"]};

            return filtered;
          },
          {} as Record<string, TransactionSignerAccount>
        );

        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {
            accounts: mappedAccounts
          }
        });
      })();
    }

    return () => abortController.abort();
  }, [dispatchFormitoAction, masterkey, dbAccounts]);

  useEffect(() => {
    if (eventDataMessage?.type === "SIGN_DATA") {
      const hasNetworkMismatch =
        eventDataMessage?.chainId === ALGORAND_NODE_CHAIN_ID
          ? false
          : eventDataMessage?.chainId !== CHAIN_ID_BY_NETWORK[preferredNetwork];

      if (hasNetworkMismatch) {
        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {
            hasNetworkMismatch
          }
        });
      }
    }

    if (eventDataMessage?.type === "SIGN_TXN") {
      const receivedTransactions: SignerTransaction[] = eventDataMessage.txn.map(
        ({txn, authAddr, msig, message, signers}) => ({
          txn: algosdk.decodeUnsignedTransaction(base64ToUint8Array(txn)),
          authAddr,
          signers,
          msig,
          message
        })
      );

      const hasNetworkMismatch = receivedTransactions.some(
        (transaction) =>
          !checkIfTransactionNetworkIsMatches(transaction.txn, preferredNetwork)
      );

      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {
          hasNetworkMismatch
        }
      });
    }
  }, [preferredNetwork, dispatchFormitoAction, eventDataMessage]);

  const onReceiveMessage = useCallback(
    (event: MessageEvent<TellerMessage<PeraTeller>>) => {
      setEventDataMessage(event.data.message);

      if (isEmbedded && event.data.message.type === "IFRAME_INITIALIZED") {
        appTellerManager.sendMessage({
          message: {
            type: "IFRAME_INITIALIZED_RECEIVED"
          },

          targetWindow: window.parent
        });
      }

      if (!isEmbedded && event.data.message.type === "TAB_OPEN") {
        appTellerManager.sendMessage({
          message: {
            type: "TAB_OPEN_RECEIVED"
          },

          targetWindow: window.opener
        });
      }

      if (
        event.data.message.type === "SIGN_DATA" &&
        (!isEmbedded || !formitoState.hasMessageReceived)
      ) {
        const hasNetworkMismatch =
          event.data.message.chainId === ALGORAND_NODE_CHAIN_ID
            ? false
            : event.data.message.chainId !== CHAIN_ID_BY_NETWORK[preferredNetwork];

        // If the chainId doesn't match the preferred network
        if (hasNetworkMismatch) {
          appTellerManager.sendMessage({
            message: {
              type: "SIGN_DATA_NETWORK_MISMATCH",
              error: NETWORK_MISMATCH_MESSAGE
            },
            targetWindow: window.opener
          });
        }

        const userAddress = event.data.message.signer;

        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {
            hasMessageReceived: true,
            hasNetworkMismatch,
            arbitraryData: event.data.message,
            userAddress,
            messageOrigin: event.origin
          }
        });
      }

      if (
        event.data.message.type === "SIGN_TXN" &&
        (!isEmbedded || !formitoState.hasMessageReceived)
      ) {
        const receivedTransactions: SignerTransaction[] = event.data.message.txn.map(
          ({txn, authAddr, msig, message, signers}) => ({
            txn: algosdk.decodeUnsignedTransaction(base64ToUint8Array(txn)),
            authAddr,
            signers,
            msig,
            message
          })
        );

        const hasNetworkMismatch = receivedTransactions.some(
          (transaction) =>
            !checkIfTransactionNetworkIsMatches(transaction.txn, preferredNetwork)
        );

        // If the transaction genesis hash doesn't matches the preferred network
        if (hasNetworkMismatch) {
          appTellerManager.sendMessage({
            message: {
              type: "SIGN_TXN_NETWORK_MISMATCH",
              error: NETWORK_MISMATCH_MESSAGE
            },
            targetWindow: window.opener
          });
        }

        const authAddresses: string[] = [];

        for (const txn of receivedTransactions) {
          if (txn.authAddr) {
            authAddresses.push(txn.authAddr);
          }
        }

        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {
            hasMessageReceived: true,
            hasNetworkMismatch,
            txns: receivedTransactions,
            messageOrigin: event.origin,
            authAddresses
          }
        });
      }
    },
    [dispatchFormitoAction, formitoState.hasMessageReceived, isEmbedded, preferredNetwork]
  );

  useTellerListener(onReceiveMessage);

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
