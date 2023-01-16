import "./_asset-list-item.scss";

import classNames from "classnames";

import SelectableListItem, {
  SelectableListItemProps
} from "../../../../component/list/selectable-list-item/SelectableListItem";
import {
  isAssetType,
  isNFT,
  renderVerificationTierIcon
} from "../../../../core/util/asset/assetUtils";
import {AccountASA} from "../../../../core/util/pera/api/peraApiModels";
import AssetLogo from "../../logo/AssetLogo";
import {getAssetImgSrc} from "../../../../core/util/image/imageUtils";

interface AssetListItemProps {
  asset: Asset | AccountASA;
  rightSide: React.ReactNode;
  onSelect: SelectableListItemProps["onSelect"];
  customClassName?: string;
}

function AssetListItem({
  asset,
  rightSide,
  onSelect,
  customClassName
}: AssetListItemProps) {
  return (
    <SelectableListItem
      id={String(asset!.asset_id)}
      onSelect={onSelect}
      isSelected={false}
      customClassName={classNames("asset-list-item", customClassName)}>
      <div className={"asset-list-item__grid-cell"}>
        <AssetLogo
          src={getAssetImgSrc(asset)}
          assetName={asset.name}
          customClassName={classNames({
            "asset-list-item__logo--is-nft": isAssetType(asset) && isNFT(asset)
          })}
        />
      </div>

      <div className={"asset-list-item__grid-cell"}>
        <div className={"align-center--vertically"}>
          <span className={"typography--medium-body"}>{asset.name}</span>

          {renderVerificationTierIcon(asset)}
        </div>

        <span className={"text-color--gray-light typography--secondary-body"}>
          {`${asset.unit_name}, ${asset.asset_id}`}
        </span>
      </div>

      {rightSide}
    </SelectableListItem>
  );
}

export default AssetListItem;
