import "./_transaction-sign-box.scss";

import {useEffect, useMemo} from "react";

import useAsyncProcess from "../../core/network/async-process/useAsyncProcess";
import {peraApi} from "../../core/util/pera/api/peraApi";
import {useTransactionSignFlowContext} from "../context/TransactionSignFlowContext";
import TransactionSignDefaultView from "./view/default/TransactionSignDefaultView";
import {
  getAssetIndexesFromTransactions,
  isTransactionTypeSupported,
  checkIfTransactionNetworkIsMatches,
  checkAuthAddressesIsValid,
  hasInvalidGroupOnTransactions
} from "../utils/transactionUtils";
import TransactionSignDetailSummaryView from "./view/detail/view/summary/TransactionSignDetailSummaryView";
import TransactionSignDetailSingleView from "./view/detail/view/single/TransactionSignDetailSingleView";
import PeraLoader from "../../component/loader/pera/PeraLoader";
import {useAppContext} from "../../core/app/AppContext";
import TransactionSignErrorState from "./error-state/TransactionSignErrorState";
import {TRANSACTION_SIGN_ERRORS} from "./error-state/util/transactionSignErrorStateConstants";
import {
  getTransactionAssetsInfoFromNode,
  NodeAsset
} from "../../core/util/asset/assetUtils";
import TransactionSignDetailRawView from "./view/detail/view/raw/TransactionSignDetailRawView";
import {encodeUnsignedTransactionInBase64} from "../../core/util/blob/blobUtils";

interface TransactionSignBoxProps {
  handleSignClick: VoidFunction;
  handleSignCancel: VoidFunction;
}

function TransactionSignBox({
  handleSignClick,
  handleSignCancel
}: TransactionSignBoxProps) {
  const {
    state: {preferredNetwork}
  } = useAppContext();
  const {
    formitoState: {transactionSignView, txns, userAddress, authAddresses},
    dispatchFormitoAction: dispatchTransactionPageAction
  } = useTransactionSignFlowContext();
  const {
    runAsyncProcess: runAssetDetailAsyncProcess,
    state: {data: assetDetailData, isRequestFetched: isAssetDetailRequestFetched}
  } = useAsyncProcess<ListRequestResponse<Asset>>();
  const txnAssetIndexList = useMemo(() => getAssetIndexesFromTransactions(txns), [txns]);
  const hasUnsupportedTxn = txns.find(
    (txn) => !isTransactionTypeSupported(txn.txn, userAddress)
  );
  const {
    runAsyncProcess: runCheckTransactionsAssetsIsInvalidProcess,
    state: {
      data: assetDetailDataFromNode,
      isRequestFetched: checkTransactionsAssetsIsInvalidRequestFetched
    }
  } = useAsyncProcess<NodeAsset[]>();
  const hasInvalidAsset = assetDetailDataFromNode === null;
  const encodedTransactions = txns.map((txn) =>
    encodeUnsignedTransactionInBase64(txn.txn)
  );

  useEffect(() => {
    if (txnAssetIndexList) {
      runCheckTransactionsAssetsIsInvalidProcess(
        getTransactionAssetsInfoFromNode(txnAssetIndexList)
      );
    }
  }, [runCheckTransactionsAssetsIsInvalidProcess, txns, txnAssetIndexList]);

  useEffect(() => {
    if (txnAssetIndexList) {
      runAssetDetailAsyncProcess(
        peraApi.getAssets({asset_ids: txnAssetIndexList.join(",")})
      );
    }
  }, [txns, runAssetDetailAsyncProcess, txnAssetIndexList]);

  useEffect(() => {
    if (assetDetailData) {
      dispatchTransactionPageAction({
        type: "SET_FORM_VALUE",
        payload: {
          transactionAssets: assetDetailData.results || []
        }
      });
    }
  }, [assetDetailData, dispatchTransactionPageAction]);

  useEffect(() => {
    if (assetDetailDataFromNode) {
      dispatchTransactionPageAction({
        type: "SET_FORM_VALUE",
        payload: {
          transactionAssetsFromNode: assetDetailDataFromNode
        }
      });
    }
  }, [assetDetailDataFromNode, dispatchTransactionPageAction]);

  return (
    <div className={"transaction-sign-box"}>
      {checkTransactionsAssetsIsInvalidRequestFetched && isAssetDetailRequestFetched ? (
        renderContent()
      ) : (
        <div className={"transaction-sign-box__spinner-wrapper"}>
          <PeraLoader mode={"colorful"} />
        </div>
      )}
    </div>
  );

  function renderContent() {
    let node;

    const hasNetworkMismatch = txns.some(
      (transaction) =>
        !checkIfTransactionNetworkIsMatches(transaction.txn, preferredNetwork)
    );

    if (hasNetworkMismatch) {
      return (
        <TransactionSignErrorState
          title={TRANSACTION_SIGN_ERRORS.NETWORK_MISMATCH.title}
          description={TRANSACTION_SIGN_ERRORS.NETWORK_MISMATCH.description}
          handleSignCancel={handleSignCancel}
          shouldRenderSettingsLink={true}
        />
      );
    }

    if (hasUnsupportedTxn) {
      return (
        <TransactionSignErrorState
          title={TRANSACTION_SIGN_ERRORS.UNSUPPORTED_TXN_TYPE.title}
          description={TRANSACTION_SIGN_ERRORS.UNSUPPORTED_TXN_TYPE.description}
          handleSignCancel={handleSignCancel}
        />
      );
    }

    if (hasInvalidAsset) {
      return (
        <TransactionSignErrorState
          title={TRANSACTION_SIGN_ERRORS.INVALID_ASSET_ID.title}
          description={TRANSACTION_SIGN_ERRORS.INVALID_ASSET_ID.description}
          handleSignCancel={handleSignCancel}
        />
      );
    }

    if (!checkAuthAddressesIsValid(authAddresses)) {
      return (
        <TransactionSignErrorState
          title={TRANSACTION_SIGN_ERRORS.AUTH_ADDRESS_NOT_VALID.title}
          description={TRANSACTION_SIGN_ERRORS.AUTH_ADDRESS_NOT_VALID.description}
          handleSignCancel={handleSignCancel}
        />
      );
    }

    if (hasInvalidGroupOnTransactions(encodedTransactions)) {
      return (
        <TransactionSignErrorState
          title={TRANSACTION_SIGN_ERRORS.OBSCURED_TRANSACTIONS.title}
          description={TRANSACTION_SIGN_ERRORS.OBSCURED_TRANSACTIONS.description}
          handleSignCancel={handleSignCancel}
        />
      );
    }

    switch (transactionSignView) {
      case "txn-detail-single":
        node = <TransactionSignDetailSingleView />;
        break;
      case "txn-detail-summary":
        node = <TransactionSignDetailSummaryView />;
        break;
      case "raw-txn":
        node = <TransactionSignDetailRawView />;
        break;
      default:
        node = (
          <TransactionSignDefaultView
            handleSignClick={handleSignClick}
            handleSignCancel={handleSignCancel}
          />
        );
    }

    return node;
  }
}

export default TransactionSignBox;
