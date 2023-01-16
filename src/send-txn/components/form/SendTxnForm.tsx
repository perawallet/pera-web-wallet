import "./_send-txn-form.scss";

import algosdk, {Transaction} from "algosdk";
import {SyntheticEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import Button from "../../../component/button/Button";
import ROUTES from "../../../core/route/routes";
import SendTxnAddressInput from "../input/address/SendTxnAddressInput";
import SendTxnAmountInput from "../input/amount/SendTxnAmountInput";
import SendTxnNoteTextArea from "../textarea/SendTxnNoteTextArea";
import {useSendTxnFlowContext} from "../../context/SendTxnFlowContext";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import SendTxnAccountLink from "../link/account/SendTxnAccountLink";
import SendTxnAssetLink from "../link/asset/SendTxnAssetLink";
import {encodeString} from "../../../core/util/string/stringUtils";
import {fractionDecimalToInteger, isALGO} from "../../../core/util/asset/assetUtils";
import {
  ALGORAND_ADDRESS_LENGTH,
  ALGORAND_TXN_NOTE_MAX_LENGTH,
  SEND_TXN_FORM_VALIDATION_MESSAGES
} from "../../util/sendTxnConstants";
import algod from "../../../core/util/algod/algod";
import {assetDBManager} from "../../../core/app/db";

const DEFAULT_MIN_ALGO_BALANCE = 100_000;

function SendTxnForm() {
  const navigate = useNavigate();
  const {display} = useSimpleToaster();
  const {
    formitoState: {
      senderAddress,
      selectedAsset,
      recipientAddress,
      txnAmount,
      txnNote,
      minBalance: prefetchedMinBalance
    },
    dispatchFormitoAction
  } = useSendTxnFlowContext();
  const isSubmitButtonDisabled = !(
    senderAddress &&
    recipientAddress &&
    recipientAddress.length === ALGORAND_ADDRESS_LENGTH &&
    txnAmount
  );
  const [shouldDisplaySpinner, setShouldDisplaySpinner] = useState(false);

  // fetch min-balance of the account for max-button
  useEffect(() => {
    if (!senderAddress || prefetchedMinBalance) return;

    (async () => {
      try {
        const {"min-balance": minBalance} = (await algod.client
          .accountInformation(senderAddress!)
          .do()) as {"min-balance": number};

        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {minBalance}
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [dispatchFormitoAction, prefetchedMinBalance, senderAddress]);

  // prefill `selectedAsset` if user has ALGO balance
  useEffect(() => {
    if (!senderAddress || selectedAsset) return;

    (async () => {
      const accountAssets = await assetDBManager.getAllByAccountAddress(senderAddress);

      const accountAlgo = accountAssets.find(isALGO);

      // Newly created zero balanced accounts do not have ALGOs
      if (accountAlgo) {
        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {selectedAsset: accountAlgo}
        });
      }
    })();
  }, [dispatchFormitoAction, selectedAsset, senderAddress]);

  return (
    <form className={"send-txn-form"} onSubmit={handleNavigateTxnConfirmation}>
      <SendTxnAccountLink />

      <SendTxnAssetLink />

      <SendTxnAddressInput />

      <SendTxnAmountInput />

      <SendTxnNoteTextArea />

      <Button
        type={"submit"}
        size={"large"}
        customClassName={"button--fluid"}
        shouldDisplaySpinner={shouldDisplaySpinner}
        isDisabled={isSubmitButtonDisabled}>
        {"Continue"}
      </Button>
    </form>
  );

  async function handleNavigateTxnConfirmation(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setShouldDisplaySpinner(true);
      const txnToSign = await prepareTxn();
      const message = validateTxn(txnToSign.fee);

      setShouldDisplaySpinner(false);

      if (message) {
        display({
          type: "error",
          message
        });

        return;
      }

      dispatchFormitoAction({type: "SET_FORM_VALUE", payload: {txnFee: txnToSign.fee}});

      navigate(ROUTES.SEND_TXN.CONFIRM.ROUTE);
    } catch (error) {
      display({
        type: "error",
        message: "There is an error preparing your transaction, please try again later."
      });
    }
  }

  /**
   * validate txn  returns error message if txn is not valid
   * returns undefined if txn is valid
   * @returns  {(string | undefined)}
   */
  function validateTxn(txnFee: number): string | undefined {
    if (!algosdk.isValidAddress(senderAddress!)) {
      return SEND_TXN_FORM_VALIDATION_MESSAGES.INVALID_ADDRESS;
    }

    const amount = fractionDecimalToInteger(
      Number(txnAmount),
      selectedAsset?.fraction_decimals
    );
    const isAccountBalanceInsufficient =
      Number(selectedAsset!.amount) <
      (isALGO(selectedAsset!)
        ? (prefetchedMinBalance || DEFAULT_MIN_ALGO_BALANCE) + txnFee + amount
        : amount);

    if (isAccountBalanceInsufficient) {
      return SEND_TXN_FORM_VALIDATION_MESSAGES.ACCOUNT_BALANCE;
    }

    if (txnNote && encodeString(txnNote).length > ALGORAND_TXN_NOTE_MAX_LENGTH) {
      return SEND_TXN_FORM_VALIDATION_MESSAGES.INVALID_TXN_LENGTH;
    }

    return undefined;
  }

  async function prepareTxn() {
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
      const assetAmount =
        // eslint-disable-next-line no-magic-numbers
        Number(txnAmount!) * Math.pow(10, selectedAsset.fraction_decimals);

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

    return txnToSign;
  }
}

export default SendTxnForm;
