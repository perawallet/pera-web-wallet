import "./_transaction-sign-box.scss";

import {useEffect, useMemo, useRef, useState} from "react";
import classNames from "classnames";
import {useSearchParams} from "react-router-dom";

import useAsyncProcess from "../../core/network/async-process/useAsyncProcess";
import {peraApi} from "../../core/util/pera/api/peraApi";
import {useTransactionSignFlowContext} from "../context/TransactionSignFlowContext";
import TransactionSignDefaultView from "./view/default/TransactionSignDefaultView";
import {
  getAssetIndexesFromTransactions,
  isTransactionTypeSupported,
  checkAuthAddressesIsValid,
  hasInvalidGroupOnTransactions,
  hasExceededGroupOnTransactions
} from "../utils/transactionUtils";
import TransactionSignDetailSummaryView from "./view/detail/view/summary/TransactionSignDetailSummaryView";
import TransactionSignDetailSingleView from "./view/detail/view/single/TransactionSignDetailSingleView";
import PeraLoader from "../../component/loader/pera/PeraLoader";
import TransactionSignErrorState from "./error-state/TransactionSignErrorState";
import {TRANSACTION_SIGN_ERRORS} from "./error-state/util/transactionSignErrorStateConstants";
import {
  getTransactionAssetsInfoFromNode,
  NodeAsset
} from "../../core/util/asset/assetUtils";
import TransactionSignDetailRawView from "./view/detail/view/raw/TransactionSignDetailRawView";
import {encodeUnsignedTransactionInBase64} from "../../core/util/blob/blobUtils";
import {MAX_ALLOWED_TRANSACTION_COUNT} from "../utils/transactionContants";
import {separateIntoChunks} from "../../core/util/array/arrayUtils";
import {PERA_ASSETS_ENDPOINT_PAGINATION_LIMIT} from "../../core/util/pera/api/peraApiConstants";
import TransactionSignArbitraryDataView from "./view/detail/view/arbitrary-data/TransactionSignArbitraryDataView";

interface TransactionSignBoxProps {
  handleSignClick: VoidFunction;
  handleSignCancel: VoidFunction;
}

function TransactionSignBox({
  handleSignClick,
  handleSignCancel
}: TransactionSignBoxProps) {
  const {
    formitoState: {
      transactionSignView,
      txns,
      arbitraryData,
      userAddress,
      authAddresses,
      hasNetworkMismatch
    },
    dispatchFormitoAction: dispatchTransactionPageAction
  } = useTransactionSignFlowContext();
  const {runAsyncProcess: runAssetDetailAsyncProcess} =
    useAsyncProcess<ListRequestResponse<Asset>>();
  const txnAssetIndexList = useMemo(() => getAssetIndexesFromTransactions(txns), [txns]);
  const hasUnsupportedTxn = txns.find(
    (txn) => !isTransactionTypeSupported(txn.txn, userAddress)
  );
  const {
    runAsyncProcess: runCheckTransactionsAssetsIsInvalidProcess,
    state: {data: assetDetailDataFromNode, error: assetDetailErrorFromNode}
  } = useAsyncProcess<NodeAsset[]>();
  const encodedTransactions = txns.map((txn) =>
    encodeUnsignedTransactionInBase64(txn.txn)
  );
  const isAllRequestsFetched = useRef(txnAssetIndexList.length === 0);
  const [hasInvalidAsset, setHasInvalidAsset] = useState(false);
  const assetDetailDataRef = useRef<ListRequestResponse<Asset> | null>(null);
  const assetDetailDataChunksRef = useRef(
    separateIntoChunks(txnAssetIndexList, PERA_ASSETS_ENDPOINT_PAGINATION_LIMIT)
  );
  const [isAllPeraRequestsFetched, setIsAllPeraRequestsFetchedFlag] = useState(false);
  const [searchParams] = useSearchParams();
  const isEmbedded = Boolean(searchParams.get("embedded"));
  const isCompactMode = searchParams.get("compactMode");

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      if (isAllRequestsFetched.current) {
        dispatchTransactionPageAction({
          type: "SET_FORM_VALUE",
          payload: {
            transactionAssetsFromNode: [],
            transactionAssets: []
          }
        });
      } else {
        for (const txnChunk of assetDetailDataChunksRef.current) {
          const assetDetailResponse = await runAssetDetailAsyncProcess(
            peraApi.getAssets(
              {asset_ids: txnChunk.join(",")},
              {
                signal: abortController.signal
              }
            )
          );

          assetDetailDataRef.current = {
            ...assetDetailResponse,
            results: [
              ...(assetDetailDataRef.current?.results || []),
              ...assetDetailResponse.results
            ]
          };
        }

        setIsAllPeraRequestsFetchedFlag(true);
      }
    })();

    return () => abortController.abort();
  }, [runAssetDetailAsyncProcess, txnAssetIndexList, dispatchTransactionPageAction]);

  useEffect(() => {
    if (assetDetailDataRef.current && assetDetailDataRef.current.results) {
      dispatchTransactionPageAction({
        type: "SET_FORM_VALUE",
        payload: {
          transactionAssets: assetDetailDataRef.current.results || []
        }
      });

      if (
        assetDetailDataRef.current.results.length !== txnAssetIndexList.length &&
        !isAllRequestsFetched.current &&
        isAllPeraRequestsFetched
      ) {
        runCheckTransactionsAssetsIsInvalidProcess(
          getTransactionAssetsInfoFromNode(txnAssetIndexList)
        );
      } else {
        isAllRequestsFetched.current = true;
      }
    }
  }, [
    dispatchTransactionPageAction,
    runCheckTransactionsAssetsIsInvalidProcess,
    txnAssetIndexList,
    isAllPeraRequestsFetched
  ]);

  useEffect(() => {
    if (assetDetailDataFromNode) {
      dispatchTransactionPageAction({
        type: "SET_FORM_VALUE",
        payload: {
          transactionAssetsFromNode: assetDetailDataFromNode
        }
      });

      isAllRequestsFetched.current = true;
    } else if (assetDetailErrorFromNode) {
      setHasInvalidAsset(true);

      isAllRequestsFetched.current = true;
    }
  }, [assetDetailDataFromNode, dispatchTransactionPageAction, assetDetailErrorFromNode]);

  if (!isAllRequestsFetched.current) {
    return (
      <div className={"transaction-sign-box"}>
        <div className={"transaction-sign-box__spinner-wrapper"}>
          <PeraLoader mode={"colorful"} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames("transaction-sign-box", {
        "transaction-sign-box--arbitrary-data":
          !!arbitraryData && !isEmbedded && transactionSignView === "txn-arbitrary-data",
        "transaction-sign-box--compact": isCompactMode === "true"
      })}>
      {renderContent()}
    </div>
  );

  function renderContent() {
    let node;

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

    if (txns.length > MAX_ALLOWED_TRANSACTION_COUNT) {
      return (
        <TransactionSignErrorState
          title={TRANSACTION_SIGN_ERRORS.MAX_TRANSACTION_EXCEEDED.title}
          description={TRANSACTION_SIGN_ERRORS.MAX_TRANSACTION_EXCEEDED.description}
          handleSignCancel={handleSignCancel}
        />
      );
    }

    if (hasExceededGroupOnTransactions(encodedTransactions)) {
      return (
        <TransactionSignErrorState
          title={TRANSACTION_SIGN_ERRORS.MAX_TRANSACTIONS_IN_GROUP_EXCEEDED.title}
          description={
            TRANSACTION_SIGN_ERRORS.MAX_TRANSACTIONS_IN_GROUP_EXCEEDED.description
          }
          handleSignCancel={handleSignCancel}
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
      case "txn-arbitrary-data":
        node = <TransactionSignArbitraryDataView />;
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
