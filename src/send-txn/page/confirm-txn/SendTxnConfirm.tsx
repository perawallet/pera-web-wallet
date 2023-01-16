/* eslint-disable no-magic-numbers */
import "./_send-txn-confirm.scss";

import {List, ListItem} from "@hipo/react-ui-toolkit";
import algosdk, {Transaction} from "algosdk";
import {useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";

import {trimAccountAddress, trimAccountName} from "../../../account/util/accountUtils";
import Button from "../../../component/button/Button";
import GoBackButton from "../../../component/go-back-button/GoBackButton";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import {useAppContext} from "../../../core/app/AppContext";
import ROUTES from "../../../core/route/routes";
import {ALGO_UNIT} from "../../../core/ui/typography/typographyConstants";
import algod from "../../../core/util/algod/algod";
import {decryptSK} from "../../../core/util/nacl/naclUtils";
import {encodeString} from "../../../core/util/string/stringUtils";
import {useSendTxnFlowContext} from "../../context/SendTxnFlowContext";
import {defaultPriceFormatter} from "../../../core/util/number/numberUtils";
import {
  formatASAAmount,
  fractionDecimalToInteger,
  isALGO
} from "../../../core/util/asset/assetUtils";
import FormatUSDBalance from "../../../component/format-balance/usd/FormatUSDBalance";
import {ALGORAND_DEFAULT_TXN_WAIT_ROUNDS} from "../../util/sendTxnConstants";

const CONFIRM_ACCOUNT_ADDRESS_DIVIDE_LENGTH = 30;

function SendTxnConfirm() {
  const navigate = useNavigate();
  const {
    state: {accounts, masterkey}
  } = useAppContext();
  const {
    formitoState: {
      senderAddress,
      selectedAsset,
      recipientAddress,
      txnAmount,
      txnNote,
      txnFee,
      exchangePrice
    }
  } = useSendTxnFlowContext();
  const {display} = useSimpleToaster();
  const [isTxnPending, setIsTxnPending] = useState(false);
  const {algoFormatter} = defaultPriceFormatter();

  if (!recipientAddress) {
    return <Navigate to={ROUTES.SEND_TXN.ROUTE} />;
  }

  return (
    <div className={"send-txn-confirm"}>
      <GoBackButton text={"Confirm Transaction"} />

      <div className={"send-txn-confirm__amount text--centered"}>
        {txnAmount && (
          <h2 className={"send-txn-confirm__amount-algo typography--h2"}>
            {isALGO(selectedAsset!)
              ? `${ALGO_UNIT}${algoFormatter(
                  algosdk.algosToMicroalgos(Number(txnAmount))
                )}`
              : `${formatASAAmount(selectedAsset!, {
                  assetAmount: Number(txnAmount),
                  inBaseUnits: false
                })}`}
          </h2>
        )}

        {isALGO(selectedAsset!) && (
          <FormatUSDBalance prefix={"≈"} value={Number(txnAmount) * exchangePrice!} />
        )}
      </div>

      <List
        items={generateTransactionDetails()}
        customClassName={"send-txn-confirm__list"}>
        {({title, description}) => (
          <ListItem customClassName={"send-txn-confirm__list-item"}>
            <p className={"text-color--gray-light"}>{title}</p>

            <div
              className={"send-txn-confirm__list-item-content typography--medium-body"}>
              {description}
            </div>
          </ListItem>
        )}
      </List>

      <Button
        onClick={handleSignTransaction}
        size={"large"}
        customClassName={"button--fluid"}
        shouldDisplaySpinner={isTxnPending}>
        {"Confirm"}
      </Button>
    </div>
  );

  async function handleSignTransaction() {
    try {
      setIsTxnPending(true);

      let txnToSign: Transaction;
      const isAssetTxn = selectedAsset && selectedAsset.name !== "ALGO";

      // prepare txn parameters
      const suggestedParams = await algod.client.getTransactionParams().do();
      let txnPayload: Parameters<
        | typeof algosdk.makePaymentTxnWithSuggestedParamsFromObject
        | typeof algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject
      >[0] = {
        from: senderAddress!,
        to: recipientAddress!,
        amount: algosdk.algosToMicroalgos(Number(txnAmount!)),
        suggestedParams,
        note: encodeString(txnNote || "")
      };

      if (isAssetTxn) {
        const assetAmount = fractionDecimalToInteger(
          Number(txnAmount!),
          selectedAsset?.fraction_decimals
        );

        txnPayload = {
          ...txnPayload,
          amount: Math.round(assetAmount),
          assetIndex: selectedAsset.asset_id
        };
        txnToSign = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(txnPayload);
      }
      // payment txn
      else {
        txnToSign = algosdk.makePaymentTxnWithSuggestedParamsFromObject(txnPayload);
      }

      // decrypt secret_key and sign
      const decryptedKey = accounts[senderAddress!].pk;
      const sk = await decryptSK(decryptedKey, masterkey!);
      const signedTxn = txnToSign.signTxn(sk!);

      // send node and wait for confirmation for routing to overview
      await algod.client.sendRawTransaction(signedTxn).do();
      await algosdk.waitForConfirmation(
        algod.client,
        txnToSign.txID().toString(),
        ALGORAND_DEFAULT_TXN_WAIT_ROUNDS
      );

      navigate(ROUTES.SEND_TXN.SUCCESS.FULL_PATH, {state: {txnId: txnToSign.txID()}});
    } catch (error: any) {
      let message = "Please try again later.";

      // TODO: search error messages in algosdk
      if (error?.message.includes("must optin")) {
        message = "Receiver must optin to receive this asset.";
      }

      console.error(error?.message);

      display({type: "error", message});
    } finally {
      setIsTxnPending(false);
    }
  }

  function generateTransactionDetails(): {title: string; description: React.ReactNode}[] {
    return [
      {
        title: "From",
        description: (
          <>
            {<p>{`${trimAccountName(accounts[senderAddress!].name!)} Account `}</p>}

            <p className={"typography--secondary-body text-color--gray-light"}>
              {trimAccountAddress(senderAddress || "")}
            </p>
          </>
        )
      },
      {
        title: "To",
        description: (
          <p className={"text--right"}>
            {recipientAddress!.slice(0, CONFIRM_ACCOUNT_ADDRESS_DIVIDE_LENGTH)}

            <br />

            {recipientAddress!.slice(CONFIRM_ACCOUNT_ADDRESS_DIVIDE_LENGTH)}
          </p>
        )
      },
      {
        title: "Note",
        description: <p className={"send-txn-confirm__txn-note"}>{txnNote || ""}</p>
      },
      {
        title: "Transaction Fee",
        description: `${algoFormatter(txnFee)} ALGO`
      }
    ];
  }
}

export default SendTxnConfirm;
