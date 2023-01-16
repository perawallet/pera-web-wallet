import {ReactComponent as ReceiveIcon} from "../../../../../../../core/ui/icons/receive.svg";
import {ReactComponent as SendIcon} from "../../../../../../../core/ui/icons/send.svg";
import {ReactComponent as ApplicationCallIcon} from "../../../../../../../core/ui/icons/application-call.svg";
import {ReactComponent as DeleteIcon} from "../../../../../../../core/ui/icons/delete.svg";
import {ReactComponent as Modifycon} from "../../../../../../../core/ui/icons/modify.svg";
import {ReactComponent as CreateIcon} from "../../../../../../../core/ui/icons/create.svg";
import {ReactComponent as WarningIcon} from "../../../../../../../core/ui/icons/warning.svg";

import "./_transaction-sign-assets-list-item.scss";

import {ListItem} from "@hipo/react-ui-toolkit";
import {OnApplicationComplete, Transaction} from "algosdk";
import classNames from "classnames";

import Image from "../../../../../../../component/image/Image";
import {
  getAssetImgSrc,
  getAssetPlaceholderContent
} from "../../../../../../../core/util/image/imageUtils";
import {useTransactionSignFlowContext} from "../../../../../../context/TransactionSignFlowContext";
import {formatNumber} from "../../../../../../../core/util/number/numberUtils";
import {
  checkIfTransactionApplicationCall,
  checkIfTransactionAssetConfig,
  checkIfTransactionIsReceive,
  checkIfTransactionOptIn,
  isAlgoTransferTransaction,
  isCreateApplicationTransaction,
  isTransactionCreateAssetConfig,
  isTransactionDeleteAssetConfig,
  isTransactionUpdateAssetConfig,
  transactionHasClearState,
  transactionHasCloseRemainder,
  transactionHasRekey
} from "../../../../../../utils/transactionUtils";
import {
  getAssetUSDValue,
  integerToFractionDecimal
} from "../../../../../../../core/util/asset/assetUtils";
import Button from "../../../../../../../component/button/Button";

interface TransactionSignAssetsListItemProps {
  transaction: Transaction;
  customClassName?: string;
}

function TransactionSignAssetsListItem({
  transaction,
  customClassName
}: TransactionSignAssetsListItemProps) {
  const {
    formitoState: {transactionAssets, userAddress, transactionAssetsFromNode, txns},
    dispatchFormitoAction: dispatchTransactionPageAction
  } = useTransactionSignFlowContext();
  const transactionAssetIndex = transaction.assetIndex;
  const transactionAsset = transactionAssets?.find(
    (asset) => asset.asset_id === transactionAssetIndex
  );
  const transactionAssetFromNode = transactionAssetsFromNode?.find(
    (asset) => asset.index === transactionAssetIndex
  );
  const isCollectible = !!transactionAsset?.collectible;
  const isReceive = checkIfTransactionIsReceive(transaction, userAddress);
  const transactionAmount = Number(transaction.amount);
  const assetAmountUSDValue = transactionAsset
    ? getAssetUSDValue({amount: transactionAmount, asset: transactionAsset})
    : "";
  const aritmeticSign = isReceive ? "+" : "-";
  const isOptInTransaction = checkIfTransactionOptIn(transaction, userAddress);
  const isApplicationCall = checkIfTransactionApplicationCall(transaction);
  const isAssetConfig = checkIfTransactionAssetConfig(transaction);
  const transactionIndex = txns.findIndex(({txn}) => txn.txID === transaction.txID);

  if (isAlgoTransferTransaction(transaction)) {
    return null;
  }

  return (
    <ListItem
      customClassName={classNames(
        "transaction-sign-assets-list-item align-items--horizontally has-space-between",
        customClassName,
        {
          "transaction-sign-assets-list-item--collectible": isCollectible
        }
      )}>
      <div className={"transaction-sign-assets-list-item__content"}>
        {transactionAsset && !isAssetConfig && (
          <Image
            customClassName={"transaction-sign-assets-list-item__asset-img"}
            // eslint-disable-next-line no-magic-numbers
            src={getAssetImgSrc(transactionAsset!, 80, 80)}
            alt={getAssetPlaceholderContent(transactionAsset!)}
          />
        )}

        {renderIcon()}

        {isCollectible && (
          <div
            className={
              "align-center--horizontally transaction-sign-assets-list-item__receive-icon-wrapper"
            }>
            {isReceive || isOptInTransaction ? <ReceiveIcon /> : <SendIcon />}
          </div>
        )}

        <div className={"transaction-sign-assets-list-item__asset-detail"}>
          <p className={"typography--medium-body"}>{getAssetTitle()}</p>

          {getAssetDescription()}
        </div>
      </div>

      {(transactionHasRekey(transaction) ||
        transactionHasCloseRemainder(transaction) ||
        transactionHasClearState(transaction)) && (
        <Button buttonType={"custom"} onClick={handleChangeView}>
          <div className={"transaction-sign-assets-list-item__warning"}>
            <WarningIcon width={20} height={20} />

            <span className={"typography--secondary-bold-body text-color--danger"}>
              {"Warning"}
            </span>
          </div>
        </Button>
      )}
    </ListItem>
  );

  /* eslint-disable complexity */
  function getAssetTitle() {
    if (transactionAmount && transactionAsset) {
      return `${aritmeticSign}${formatNumber({maximumFractionDigits: 2})(
        integerToFractionDecimal(transactionAmount, transactionAsset?.fraction_decimals)
      )} ${transactionAsset?.name}`;
    }

    if (isOptInTransaction) {
      return `Opt-In to ${
        transactionAsset?.name || transactionAssetFromNode?.params.name
      }`;
    }

    if (isApplicationCall) {
      if (isCreateApplicationTransaction(transaction)) {
        return `Create Application`;
      }

      switch (transaction.appOnComplete) {
        case OnApplicationComplete.OptInOC:
          return `Opt-In to #${transaction.appIndex}`;
        case OnApplicationComplete.CloseOutOC:
          return `Close Out Application #${transaction.appIndex}`;
        case OnApplicationComplete.UpdateApplicationOC:
          return `Modify Application #${transaction.appIndex}`;
        case OnApplicationComplete.DeleteApplicationOC:
          return `Destroy Application #${transaction.appIndex}`;
        default:
          return `Application Call to #${transaction.appIndex}`;
      }
    }

    if (isAssetConfig) {
      if (isTransactionCreateAssetConfig(transaction)) {
        return transaction.assetName
          ? `Create "${transaction.assetName}" Asset`
          : "Create Asset";
      }

      if (isTransactionUpdateAssetConfig(transaction)) {
        return `Modify "${
          transactionAsset?.name || transactionAssetFromNode?.params.name
        }" Asset`;
      }

      if (isTransactionDeleteAssetConfig(transaction)) {
        return `Destroy "${
          transactionAsset?.name || transactionAssetFromNode?.params.name
        }" Asset`;
      }
    }

    if (isCollectible) {
      return `${isReceive ? "" : "Transfer "}${
        transactionAsset?.name || transactionAssetFromNode?.params.name
      }`;
    }

    return transactionAsset?.name;
  }

  /* eslint-enable complexity */

  function getAssetDescription() {
    if (isCollectible) {
      return (
        <div
          className={
            "typography--secondary-body text-color--gray-light align-center--vertically transaction-sign-assets-list-item__collectible-description"
          }>
          {`${transactionAsset?.name} `}

          <span className={"bullet"} />

          {` ${transactionAsset?.asset_id}`}
        </div>
      );
    }

    if (assetAmountUSDValue) {
      return (
        <p className={"typography--secondary-body text-color--gray-light"}>
          {`≈ $${assetAmountUSDValue}`}
        </p>
      );
    }

    return (
      <p className={"typography--secondary-body text-color--gray-light"}>
        {transactionAsset?.asset_id}
      </p>
    );
  }

  function renderIcon() {
    if (isApplicationCall) {
      if (isCreateApplicationTransaction(transaction)) {
        return <CreateIcon />;
      }

      switch (transaction.appOnComplete) {
        case OnApplicationComplete.UpdateApplicationOC:
          return <Modifycon />;
        case OnApplicationComplete.DeleteApplicationOC:
          return <DeleteIcon />;
        default:
          return <ApplicationCallIcon />;
      }
    }

    if (isAssetConfig) {
      if (isTransactionCreateAssetConfig(transaction)) {
        return <CreateIcon />;
      }

      if (isTransactionUpdateAssetConfig(transaction)) {
        return <Modifycon />;
      }

      if (isTransactionDeleteAssetConfig(transaction)) {
        return <DeleteIcon />;
      }
    }

    return null;
  }

  function handleChangeView() {
    dispatchTransactionPageAction({
      type: "SET_FORM_VALUE",
      payload: {
        activeTransactionIndex: transactionIndex,
        transactionSignView: "txn-detail-single"
      }
    });
  }
}

export default TransactionSignAssetsListItem;
