import classNames from "classnames";
import {microalgosToAlgos} from "algosdk";

import {
  integerToFractionDecimal,
  renderVerificationTierIcon
} from "../../../../../../../core/util/asset/assetUtils";
import {
  getAssetImgSrc,
  getAssetPlaceholderContent
} from "../../../../../../../core/util/image/imageUtils";
import {useTransactionSignFlowContext} from "../../../../../../context/TransactionSignFlowContext";
import Image from "../../../../../../../component/image/Image";
import {uint8ArrayToString} from "../../../../../../../core/util/blob/blobUtils";
import {formatNumber} from "../../../../../../../core/util/number/numberUtils";
import {ALGO_UNIT} from "../../../../../../../core/ui/typography/typographyConstants";
import Button from "../../../../../../../component/button/Button";

function TransactionSignDetailList() {
  const {
    formitoState: {
      txns,
      activeTransactionIndex,
      transactionAssets,
      transactionAssetsFromNode
    },
    dispatchFormitoAction
  } = useTransactionSignFlowContext();
  const activeTransaction = txns[activeTransactionIndex];
  const activeTransactionAsset = transactionAssets?.find(
    (asset) => asset.asset_id === activeTransaction.txn.assetIndex
  );
  const activeTransactionAssetFromNode = transactionAssetsFromNode?.find(
    (asset) => asset.index === activeTransaction.txn.assetIndex
  );
  const isCollectible = !!activeTransactionAsset?.collectible;

  return (
    <div className={"transaction-sign-detail-single-view__transaction-details-list"}>
      {(activeTransactionAsset || activeTransactionAssetFromNode) && (
        <div
          className={
            "transaction-sign-detail-single-view__transaction-details-list__item"
          }>
          <div>
            <h1
              className={
                "typography--body text-color--gray transaction-sign-detail-single-view__transaction-details-list__item__title"
              }>
              {"Asset"}
            </h1>

            <div className={"transaction-sign-detail-single-view__asset-detail"}>
              {activeTransactionAsset && (
                <Image
                  customClassName={classNames(
                    "transaction-sign-detail-single-view__asset-img",
                    {
                      "transaction-sign-detail-single-view__asset-img--collectible":
                        isCollectible
                    }
                  )}
                  // eslint-disable-next-line no-magic-numbers
                  src={getAssetImgSrc(activeTransactionAsset, 80, 80)}
                  alt={getAssetPlaceholderContent(activeTransactionAsset)}
                />
              )}

              <div>
                <div
                  className={
                    "transaction-sign-detail-single-view__asset-detail__asset-name"
                  }>
                  <p>
                    {activeTransactionAsset?.name ||
                      activeTransactionAssetFromNode?.params.name}
                  </p>

                  {!isCollectible &&
                    activeTransactionAsset &&
                    renderVerificationTierIcon(activeTransactionAsset)}
                </div>

                <div
                  className={
                    "text-color--gray-light transaction-sign-detail-single-view__asset-detail__asset-information"
                  }>
                  <p>
                    {activeTransactionAsset?.asset_id ||
                      activeTransactionAssetFromNode?.index}
                  </p>

                  <span className={"bullet"} />

                  <p>
                    {activeTransactionAsset?.unit_name ||
                      activeTransactionAssetFromNode?.params.unitName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTransaction.txn.amount && (
        <div
          className={
            "transaction-sign-detail-single-view__transaction-details-list__item"
          }>
          <h1
            className={
              "typography--body text-color--gray transaction-sign-detail-single-view__transaction-details-list__item__title"
            }>
            {"Amount"}
          </h1>

          <p className={"typography--medium-body"}>{getTransactionAmount()}</p>
        </div>
      )}

      <div
        className={"transaction-sign-detail-single-view__transaction-details-list__item"}>
        <h1
          className={
            "typography--body text-color--gray transaction-sign-detail-single-view__transaction-details-list__item__title"
          }>
          {"Network Fee"}
        </h1>

        <p className={"typography--medium-body"}>{`- ${ALGO_UNIT}${microalgosToAlgos(
          activeTransaction.txn.fee
        )}`}</p>
      </div>

      {activeTransaction.txn.note && activeTransaction.txn.note?.length > 0 && (
        <div
          className={
            "transaction-sign-detail-single-view__transaction-details-list__item"
          }>
          <h1
            className={
              "typography--body text-color--gray transaction-sign-detail-single-view__transaction-details-list__item__title"
            }>
            {"Note"}
          </h1>

          <p
            className={
              "transaction-sign-detail-single-view__transaction-note typography--medium-body"
            }>
            {uint8ArrayToString(activeTransaction.txn.note)}
          </p>
        </div>
      )}

      <div className={"transaction-sign-detail-single-view__actions"}>
        <Button
          customClassName={"transaction-sign-detail-single-view__actions__button"}
          buttonType={"custom"}
          onClick={handleChangeView}>
          {"Raw Transaction"}
        </Button>
      </div>
    </div>
  );

  function getTransactionAmount() {
    let transactionAmount = `${ALGO_UNIT}${formatNumber({maximumFractionDigits: 2})(
      microalgosToAlgos(Number(activeTransaction.txn.amount || ""))
    )}`;

    if (activeTransactionAsset) {
      transactionAmount = `${formatNumber({maximumFractionDigits: 2})(
        integerToFractionDecimal(
          Number(activeTransaction.txn.amount),
          activeTransactionAsset?.fraction_decimals
        )
      )} ${activeTransactionAsset.name}`;
    }
    return transactionAmount;
  }

  function handleChangeView() {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        transactionSignView: "raw-txn"
      }
    });
  }
}

export default TransactionSignDetailList;
