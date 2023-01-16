import "./_send-txn-select-asset-list-item.scss";

import AssetListItem from "../../../../asset/components/list/item/AssetListItem";
import FormatUSDBalance from "../../../../component/format-balance/usd/FormatUSDBalance";
import {SelectableListItemProps} from "../../../../component/list/selectable-list-item/SelectableListItem";
import {formatASAAmount, isALGO} from "../../../../core/util/asset/assetUtils";
import {defaultPriceFormatter} from "../../../../core/util/number/numberUtils";
import {AccountASA} from "../../../../core/util/pera/api/peraApiModels";

interface SendTxnSelectAssetListItemProps {
  asset: AccountASA;
  onSelect: SelectableListItemProps["onSelect"];
}

function SendTxnSelectAssetListItem({asset, onSelect}: SendTxnSelectAssetListItemProps) {
  const {algoFormatter} = defaultPriceFormatter();
  const assetAmount = isALGO(asset)
    ? algoFormatter(Number(asset.amount))
    : formatASAAmount(asset);

  return (
    <AssetListItem
      asset={asset}
      rightSide={
        <div className={"send-txn-select-asset-list-item__grid-cell"}>
          <p>{`${assetAmount}`}</p>

          <FormatUSDBalance
            value={asset.balance_usd_value}
            customClassName={"text-color--gray-light typography--secondary-body"}
          />
        </div>
      }
      onSelect={onSelect}
    />
  );
}

export default SendTxnSelectAssetListItem;
