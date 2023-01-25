import "./_transaction-sign-tab-view.scss";

import algosdk from "algosdk";
import {useCallback, useEffect} from "react";

import appTellerManager, {PeraTeller} from "../../../core/app/teller/appTellerManager";
import {base64ToUint8Array, uint8ArrayToBase64} from "../../../core/util/blob/blobUtils";
import {useAppContext} from "../../../core/app/AppContext";
import useTellerListener from "../../../core/util/hook/useTellerListener";
import TransactionSignBox from "../../sign-box/TransactionSignBox";
import {decryptSK} from "../../../core/util/nacl/naclUtils";
import PasswordAccessPage from "../../../password/page/access/PasswordAccessPage";
import {useTransactionSignFlowContext} from "../../context/TransactionSignFlowContext";
import {NETWORK_MISMATCH_MESSAGE} from "../../../core/util/algod/algodConstants";
import {
  checkIfTransactionNetworkIsMatches,
  getSignerAddress
} from "../../utils/transactionUtils";
import PeraLoader from "../../../component/loader/pera/PeraLoader";
import {SignerTransaction} from "../../../core/util/model/peraWalletModel";

function TransactionSignTabView() {
  const {
    state: {accounts, sessions, masterkey, preferredNetwork}
  } = useAppContext();
  const {
    formitoState: {txns, currentSession, hasMessageReceived, messageOrigin},
    dispatchFormitoAction
  } = useTransactionSignFlowContext();

  useEffect(() => {
    if (hasMessageReceived && masterkey) {
      if (sessions[messageOrigin]) {
        let userAddress;

        for (const transaction of txns) {
          const fromAddress = algosdk.encodeAddress(
            transaction.txn.from?.publicKey || new Uint8Array(0)
          );
          const toAddress = algosdk.encodeAddress(
            transaction.txn.to?.publicKey || new Uint8Array(0)
          );

          userAddress = sessions[messageOrigin].accountAddresses.find(
            (address) => address === fromAddress || address === toAddress
          );

          if (userAddress) {
            break;
          }
        }

        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {
            currentSession: sessions[messageOrigin],
            userAddress,
            userAccountName: userAddress ? accounts[userAddress]?.name : undefined
          }
        });
      } else {
        appTellerManager.sendMessage({
          message: {
            type: "SESSION_DISCONNECTED",
            error: "The session is not active anymore."
          },
          targetWindow: window.opener
        });
      }
    }
  }, [
    hasMessageReceived,
    masterkey,
    sessions,
    messageOrigin,
    txns,
    accounts,
    dispatchFormitoAction
  ]);

  const onReceiveMessage = useCallback(
    (event: MessageEvent<TellerMessage<PeraTeller>>) => {
      if (event.data.message.type === "TAB_OPEN") {
        appTellerManager.sendMessage({
          message: {
            type: "TAB_OPEN_RECEIVED"
          },

          targetWindow: window.opener
        });
      }

      if (event.data.message.type === "SIGN_TXN") {
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
            txns: receivedTransactions,
            messageOrigin: event.origin,
            authAddresses
          }
        });
      }
    },
    [dispatchFormitoAction, preferredNetwork]
  );

  useTellerListener(onReceiveMessage);

  return <div className={"transaction-sign-tab-view"}>{renderContent()}</div>;

  function renderContent() {
    if (!masterkey) {
      return (
        <div className={"transaction-sign-tab-view__access-page"}>
          <PasswordAccessPage type={"connect-new-tab"} />
        </div>
      );
    }

    if (currentSession && hasMessageReceived) {
      return (
        <TransactionSignBox
          handleSignClick={handleSignClick}
          handleSignCancel={handleSignCancel}
        />
      );
    }

    return (
      <div className={"transaction-sign-tab-view__spinner-wrapper"}>
        <PeraLoader mode={"colorful"} />
      </div>
    );
  }

  function handleSignCancel() {
    appTellerManager.sendMessage({
      message: {
        type: "SIGN_TXN_CALLBACK_ERROR",
        error: "Transaction signing is cancelled"
      },
      targetWindow: window.opener
    });
  }

  function handleSignClick() {
    if (masterkey) {
      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {
          isSignStarted: true
        }
      });

      const signedTxns: SignedTxn[] = [];

      txns.forEach(async (txnToSign) => {
        const signerAddress = getSignerAddress(txnToSign);

        // If the from address is not in the accounts, then it shouldn't be signed
        // It also gives an extra layer of security,
        // user SHOULD only sign the current session's txns
        if (!currentSession?.accountAddresses.includes(signerAddress)) {
          // Filter out the txns that are not requires to be signed
          return;
        }

        const account = accounts[signerAddress];
        const pk = await decryptSK(account.pk, masterkey);
        const signedTxn = algosdk.signTransaction(txnToSign.txn, pk!);

        signedTxns.push({
          txnId: signedTxn.txID,
          signedTxn: uint8ArrayToBase64(signedTxn.blob)
        });
      });

      appTellerManager.sendMessage({
        message: {
          type: "SIGN_TXN_CALLBACK",
          signedTxns
        },
        targetWindow: window.opener
      });
    }
  }
}
export default TransactionSignTabView;
