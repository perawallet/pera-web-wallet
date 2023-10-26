import "./_transaction-sign-tab-view.scss";

import algosdk from "algosdk";
import {useEffect, useState} from "react";
import {useToaster} from "@hipo/react-ui-toolkit";

import {uint8ArrayToBase64} from "../../../core/util/blob/blobUtils";
import {useAppContext} from "../../../core/app/AppContext";
import TransactionSignBox from "../../sign-box/TransactionSignBox";
import {useTransactionSignFlowContext} from "../../context/TransactionSignFlowContext";
import {getSignerAddress} from "../../utils/transactionUtils";
import PeraLoader from "../../../component/loader/pera/PeraLoader";
import useTxnSigner from "../../../core/util/hook/useTxnSigner";
import appTellerManager from "../../../core/app/teller/appTellerManager";
import PeraConnectErrorScreen from "../../../pera-connect-error/PeraConnectErrorScreen";
import {PERA_CONNECT_SHOW_ERROR_SCREEN_TIMEOUT} from "../../../pera-connect-error/util/peraConnectErrorScreenConstants";
import PeraToast from "../../../component/pera-toast/PeraToast";
import {SIGN_LEDGER_DATA_SIGN_INFO_TOAST_ID} from "../../utils/transactionContants";
import {getAccountType} from "../../../account/util/accountUtils";

function TransactionSignTabView() {
  const {
    state: {sessions, masterkey}
  } = useAppContext();
  const {
    formitoState: {
      txns,
      arbitraryData,
      currentSession,
      hasMessageReceived,
      messageOrigin,
      accounts
    },
    dispatchFormitoAction
  } = useTransactionSignFlowContext();
  const signer = useTxnSigner();
  const [shouldShowErrorScreen, setShouldShowErrorScreen] = useState(false);
  const toaster = useToaster();

  useEffect(() => {
    const messageReceivedTimeout = setTimeout(() => {
      setShouldShowErrorScreen(true);
    }, PERA_CONNECT_SHOW_ERROR_SCREEN_TIMEOUT);

    return () => clearTimeout(messageReceivedTimeout);
  }, []);

  useEffect(() => {
    if (hasMessageReceived && masterkey) {
      if (sessions[messageOrigin]) {
        let userAddress;

        if (arbitraryData) {
          userAddress = arbitraryData.signer;
        } else {
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

            // eslint-disable-next-line max-depth
            if (userAddress) break;
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
    dispatchFormitoAction,
    arbitraryData,
    accounts
  ]);

  if (shouldShowErrorScreen && !currentSession && !hasMessageReceived) {
    return (
      <div className={"transaction-sign-tab-view__access-page"}>
        <PeraConnectErrorScreen />
      </div>
    );
  }

  return (
    <div className={"transaction-sign-tab-view"}>
      {currentSession && hasMessageReceived ? (
        <TransactionSignBox
          handleSignClick={handleSignClick}
          handleSignCancel={handleSignCancel}
        />
      ) : (
        <div className={"transaction-sign-tab-view__spinner-wrapper"}>
          <PeraLoader mode={"colorful"} />
        </div>
      )}
    </div>
  );

  function handleSignCancel() {
    appTellerManager.sendMessage({
      message: arbitraryData
        ? {
            type: "SIGN_DATA_CALLBACK_ERROR",
            error: "Data signing is cancelled"
          }
        : {
            type: "SIGN_TXN_CALLBACK_ERROR",
            error: "Transaction signing is cancelled"
          },
      targetWindow: window.opener
    });
  }

  async function handleSignClick() {
    if (!masterkey || !signer) return;

    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {isSignStarted: true}
    });

    if (arbitraryData) {
      const account = accounts[sessions[messageOrigin].accountAddresses[0]];
      const shouldSignArbitraryData =
        arbitraryData.data.length > 0 &&
        arbitraryData.data.every((data) => !!data.message && !!data.data);

      if (!shouldSignArbitraryData) {
        toaster.display({
          id: SIGN_LEDGER_DATA_SIGN_INFO_TOAST_ID,
          render() {
            return (
              <PeraToast
                type={"info"}
                title={"Empty Data"}
                detail={"Data is not signed for security reasons."}
              />
            );
          }
        });
        return;
      }

      const isLedgerAuthAccount =
        getAccountType(account.rekeyed_to ? accounts[account.rekeyed_to] : account) ===
        "ledger";

      // ledger firmware does not support data sign yet
      if (isLedgerAuthAccount) {
        toaster.display({
          id: SIGN_LEDGER_DATA_SIGN_INFO_TOAST_ID,
          render() {
            return (
              <PeraToast
                type={"info"}
                title={"Ledger Data Sign Support"}
                detail={"Data sign is not supported on ledger yet."}
              />
            );
          }
        });
        return;
      }

      try {
        const {signedArbitraryData} = await signer
          .arbitraryDataTxn({data: arbitraryData.data})
          .sign(arbitraryData.signer, {sendNetwork: false});

        if (signedArbitraryData) {
          appTellerManager.sendMessage({
            message: {
              type: "SIGN_DATA_CALLBACK",
              signedData: signedArbitraryData.map((data) => ({
                signedData: uint8ArrayToBase64(data.data)
              }))
            },
            targetWindow: window.opener
          });
        }
      } catch {
        toaster.display({
          id: SIGN_LEDGER_DATA_SIGN_INFO_TOAST_ID,
          render() {
            return (
              <PeraToast
                type={"error"}
                title={"Somethings got wrong"}
                detail={"Failed to sign personal data."}
              />
            );
          }
        });

        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {isSignStarted: false}
        });
      }
    } else {
      try {
        const signedTxns: SignedTxn[] = [];

        for (const txnToSign of txns) {
          const signerAddress = getSignerAddress(txnToSign);

          // If the from address is not in the accounts, then it shouldn't be signed
          // It also gives an extra layer of security,
          // user SHOULD only sign the current session's txns
          // Filter out the txns that are not requires to be signed
          // eslint-disable-next-line no-continue
          if (!currentSession?.accountAddresses.includes(signerAddress)) continue;

          const {signedTxn} = await signer
            .rawTxn(txnToSign.txn)
            .sign(signerAddress, {sendNetwork: false});

          signedTxns.push({
            txnId: txnToSign.txn.txID(),
            signedTxn: uint8ArrayToBase64(signedTxn!)
          });
        }

        appTellerManager.sendMessage({
          message: {
            type: "SIGN_TXN_CALLBACK",
            signedTxns
          },
          targetWindow: window.opener
        });
      } catch (error) {
        toaster.display({
          id: SIGN_LEDGER_DATA_SIGN_INFO_TOAST_ID,
          render() {
            return (
              <PeraToast
                type={"error"}
                title={"Somethings got wrong"}
                detail={"Failed to sign transaction."}
              />
            );
          }
        });

        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {isSignStarted: false}
        });
      }
    }
  }
}
export default TransactionSignTabView;
