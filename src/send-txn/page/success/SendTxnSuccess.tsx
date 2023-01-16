/* eslint-disable react/jsx-key */
import "./_send-txn-success.scss";

import {ReactComponent as CheckmarkIcon} from "../../../core/ui/icons/checkmark.svg";
import {ReactComponent as ExportIcon} from "../../../core/ui/icons/export.svg";
import {ReactComponent as ArrowRightIcon} from "../../../core/ui/icons/arrow-right.svg";

import algosdk from "algosdk";
import {Navigate} from "react-router-dom";
import {List, ListItem} from "@hipo/react-ui-toolkit";

import {useSendTxnFlowContext} from "../../context/SendTxnFlowContext";
import {trimAccountAddress, trimAccountName} from "../../../account/util/accountUtils";
import {defaultPriceFormatter} from "../../../core/util/number/numberUtils";
import ClipboardButton from "../../../component/clipboard/button/ClipboardButton";
import useLocationWithState from "../../../core/util/hook/useLocationWithState";
import ROUTES from "../../../core/route/routes";
import LinkButton from "../../../component/button/LinkButton";
import {isALGO} from "../../../core/util/asset/assetUtils";
import {generateAlgoExplorerLink} from "../../../core/util/algoExplorer/algoExplorerUtils";
import {useAppContext} from "../../../core/app/AppContext";

type LocationState = {txnId: string};

function SendTxnSuccess() {
  const {
    state: {accounts}
  } = useAppContext();
  const {
    formitoState: {senderAddress, selectedAsset, recipientAddress, txnAmount}
  } = useSendTxnFlowContext();
  const {txnId} = useLocationWithState<LocationState>();
  const {algoFormatter} = defaultPriceFormatter();

  if (!txnId) {
    return <Navigate to={ROUTES.SEND_TXN.ROUTE} />;
  }

  return (
    <div className={"send-txn-success"}>
      <div className={"send-txn-success__icon align-center--horizontally"}>
        <CheckmarkIcon width={56} height={56} />
      </div>

      <h2 className={"send-txn-success__header typography--h2"}>
        {"Transaction Submitted"}
      </h2>

      <p className={"send-txn-success__subheader"}>
        {"Your transaction was successfully submitted to the Algorand network"}
      </p>

      <List items={generateTxnSummary()} customClassName={"send-txn-success__list"}>
        {([from, middle, to]) => (
          <ListItem customClassName={"send-txn-success__list-item"}>
            <p className={"text-color--gray-light"}>{from}</p>

            {middle && middle}

            {to && to}
          </ListItem>
        )}
      </List>

      <LinkButton
        buttonType={"secondary"}
        to={ROUTES.OVERVIEW.ROUTE}
        customClassName={"send-txn-success__link"}>
        {"Back to Accounts"}
      </LinkButton>

      <LinkButton
        external={true}
        target={"_blank"}
        rel={"noopener noreferrer"}
        to={generateAlgoExplorerLink("txn-id", txnId)}
        buttonType={"light"}
        customClassName={"send-txn-success__link"}>
        {"View on Algo Explorer"}
        <ExportIcon width={20} height={20} />
      </LinkButton>
    </div>
  );

  function generateTxnSummary() {
    let amount = `${algoFormatter(algosdk.algosToMicroalgos(Number(txnAmount)))} ALGO`;

    if (selectedAsset && !isALGO(selectedAsset)) {
      amount = `${txnAmount} ${selectedAsset.unit_name}`;
    }

    return [
      [
        <>
          <p className={"typography--medium-body text-color--main"}>{`${trimAccountName(
            accounts[senderAddress!].name
          )} Account `}</p>

          <p className={"typography--secondary-body text-color--gray-light"}>
            {trimAccountAddress(senderAddress!)}
          </p>
        </>,
        <div className={"send-txn-success__arrow-icon-wrapper"}>
          <ArrowRightIcon width={24} height={24} />
        </div>,

        <p className={"typography--medium-body"}>
          {trimAccountAddress(recipientAddress!)}
        </p>
      ],
      ["Amount", <p className={"typography--medium-body text-color--main"}>{amount}</p>],
      [
        "Transaction ID",
        <div>
          <ClipboardButton
            iconPosition={"right"}
            textToCopy={txnId!}
            customClassName={"send-txn-success__clipboard-button"}
            aria-label={"Copy account address to clipboard"}>
            <p className={"typography--medium-body text-color--main"}>
              {/* eslint-disable-next-line no-magic-numbers */}
              {`${txnId!.slice(0, 10)}...`}
            </p>
          </ClipboardButton>
        </div>
      ]
    ];
  }
}

export default SendTxnSuccess;
