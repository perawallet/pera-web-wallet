import "./_send-txn-amount-input.scss";

import algosdk from "algosdk";
import {SyntheticEvent, useEffect, useRef} from "react";
import {FormField, NumberInput} from "@hipo/react-ui-toolkit";

import {useSendTxnFlowContext} from "../../../context/SendTxnFlowContext";
import Button from "../../../../component/button/Button";
import {isALGO} from "../../../../core/util/asset/assetUtils";
import FormatUSDBalance from "../../../../component/format-balance/usd/FormatUSDBalance";
import {formatNumber} from "../../../../core/util/number/numberUtils";
import {useSimpleToaster} from "../../../../component/simple-toast/util/simpleToastHooks";
import useFormito from "../../../../core/util/hook/formito/useFormito";
import {useAppContext} from "../../../../core/app/AppContext";
import {usePortfolioContext} from "../../../../overview/context/PortfolioOverviewContext";

const AMOUNT_INPUT_DEFAULT_FRACTION_DIGITS = 2;

interface AmountInputState {
  dollarAmount?: number;
}

function SendTxnAmountInput() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    state: {preferredNetwork}
  } = useAppContext();
  const {
    formitoState: {exchangePrice, senderAddress, selectedAsset, txnAmount, txnFee},
    dispatchFormitoAction
  } = useSendTxnFlowContext();
  const portfolioOverview = usePortfolioContext();
  const {
    formitoState: {dollarAmount},
    dispatchFormitoAction: dispatchAmountInputAction
  } = useFormito<AmountInputState>({
    dollarAmount: undefined
  });
  const simpleToaster = useSimpleToaster();

  const shouldDisplayDollarAmount =
    !!txnAmount && (!selectedAsset || isALGO(selectedAsset));
  const inputMaxFractionDigits =
    selectedAsset?.fraction_decimals || AMOUNT_INPUT_DEFAULT_FRACTION_DIGITS;
  const maxButtonAmountFormatter = formatNumber({
    useGrouping: false,
    maximumFractionDigits: inputMaxFractionDigits,
    minimumFractionDigits: 2
  });

  useEffect(() => {
    if (
      shouldDisplayDollarAmount &&
      exchangePrice &&
      exchangePrice !== 0 &&
      txnAmount &&
      Number(txnAmount) > 0
    ) {
      // dynamically adjust input width to show dollar amount at the end of amount value
      inputRef.current!.style.width = `${txnAmount?.length}ch`;

      const amountInUsd = exchangePrice! * Number(txnAmount);

      dispatchAmountInputAction({
        type: "SET_FORM_VALUE",
        payload: {dollarAmount: amountInUsd}
      });
    } else {
      // hide approximate dollar amount and fix input width
      inputRef.current!.style.width = `auto`;
    }
  }, [
    dispatchAmountInputAction,
    dollarAmount,
    exchangePrice,
    selectedAsset,
    shouldDisplayDollarAmount,
    txnAmount
  ]);

  return (
    <FormField label={"Amount"} customClassName={"send-txn-amount__input-form-field"}>
      <label className={"send-txn-amount__input-container"}>
        <NumberInput
          ref={inputRef}
          maximumFractionDigits={inputMaxFractionDigits}
          value={txnAmount || ""}
          onChange={handleInputChange}
          name={"txnAmount"}
          placeholder={`0.00 ${selectedAsset?.unit_name || "ALGO"}`}
        />

        {shouldDisplayDollarAmount && dollarAmount && preferredNetwork === "mainnet" && (
          <span
            className={
              "send-txn-amount__value-placeholder text-color--gray-light typography--secondary-body"
            }>
            <span className={"typography--bold-body text-color--gray"}>
              {selectedAsset?.unit_name}
            </span>

            <FormatUSDBalance
              customClassName={"send-txn-amount__usd-value"}
              prefix={" ≈ "}
              value={dollarAmount}
            />
          </span>
        )}
      </label>

      <Button
        onClick={handleMaxButtonClick}
        buttonType={"secondary"}
        size={"small"}
        customClassName={"send-txn-amount__max-button"}
        isDisabled={!senderAddress || !selectedAsset}>
        {"MAX"}
      </Button>
    </FormField>
  );

  function handleMaxButtonClick() {
    let amount: string | number | undefined;
    const minBalance = portfolioOverview!.accounts[senderAddress!].minimum_balance;

    if (!minBalance || !selectedAsset) return;

    if (isALGO(selectedAsset)) {
      const amountInMicroAlgos = Number(selectedAsset.amount) - txnFee - minBalance;

      if (amountInMicroAlgos >= 0) {
        amount = algosdk.microalgosToAlgos(amountInMicroAlgos);
      } else {
        simpleToaster.display({
          type: "info",
          message:
            "Account has min balance, either fund your account or opt-out unused assets of yours."
        });
      }
    } else {
      amount = maxButtonAmountFormatter(
        Number(selectedAsset.amount) /
          // eslint-disable-next-line no-magic-numbers
          Math.pow(10, selectedAsset.fraction_decimals || 0)
      );
    }

    if (amount && typeof amount === "number" && amount > 0) {
      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {txnAmount: String(amount)}
      });
    }
  }

  function handleInputChange(event: SyntheticEvent<HTMLInputElement>) {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {txnAmount: event.currentTarget.value}
    });
  }
}

export default SendTxnAmountInput;
