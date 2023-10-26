/* eslint-disable no-magic-numbers */
import "./_send-txn-confirm.scss";

import {List, ListItem} from "@hipo/react-ui-toolkit";
import algosdk from "algosdk";
import {useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";

import {trimAccountAddress, trimAccountName} from "../../../account/util/accountUtils";
import Button from "../../../component/button/Button";
import GoBackButton from "../../../component/go-back-button/GoBackButton";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import ROUTES from "../../../core/route/routes";
import {ALGO_UNIT} from "../../../core/ui/typography/typographyConstants";
import {useSendTxnFlowContext} from "../../context/SendTxnFlowContext";
import {defaultPriceFormatter} from "../../../core/util/number/numberUtils";
import {
  formatASAAmount,
  fractionDecimalToInteger,
  isALGO
} from "../../../core/util/asset/assetUtils";
import FormatUSDBalance from "../../../component/format-balance/usd/FormatUSDBalance";
import useTxnSigner from "../../../core/util/hook/useTxnSigner";
import {usePortfolioContext} from "../../../overview/context/PortfolioOverviewContext";

const CONFIRM_ACCOUNT_ADDRESS_DIVIDE_LENGTH = 30;

function SendTxnConfirm() {
  const navigate = useNavigate();
  const {accounts} = usePortfolioContext()!;
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
  const signer = useTxnSigner();

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
            <p className={"text-color--gray-lighter"}>{title}</p>

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
    if (!signer || !selectedAsset) return;

    try {
      setIsTxnPending(true);

      await (selectedAsset.name === "ALGO"
        ? signer.paymentTxn({
            from: senderAddress!,
            to: recipientAddress!,
            amount: algosdk.algosToMicroalgos(Number(txnAmount!)),
            note: txnNote
          })
        : signer.assetTransferTxn({
            from: senderAddress!,
            to: recipientAddress!,
            assetIndex: selectedAsset.asset_id,
            amount: fractionDecimalToInteger(
              Number(txnAmount!),
              selectedAsset?.fraction_decimals
            ),
            note: txnNote
          })
      ).sign(senderAddress!, {sendNetwork: true});

      navigate(ROUTES.SEND_TXN.SUCCESS.FULL_PATH, {
        // eslint-disable-next-line no-underscore-dangle
        state: {txnId: signer._transaction!.txID()}
      });
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

            <p className={"typography--secondary-body text-color--gray-lighter"}>
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
