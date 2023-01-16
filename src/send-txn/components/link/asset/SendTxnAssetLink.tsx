import Tooltip from "../../../../component/tooltip/Tooltip";
import ROUTES from "../../../../core/route/routes";
import {getAssetImgSrc} from "../../../../core/util/image/imageUtils";
import {useSendTxnFlowContext} from "../../../context/SendTxnFlowContext";
import SendTxnLink from "../SendTxnLink";
import {formatASAAmount} from "../../../../core/util/asset/assetUtils";
import AssetLogo from "../../../../asset/components/logo/AssetLogo";

function SendTxnAssetLink() {
  const {
    formitoState: {senderAddress, selectedAsset}
  } = useSendTxnFlowContext();

  return (
    <Tooltip.Optional
      withinTooltip={!senderAddress}
      dataFor={"send-txn-form__select-asset"}
      content={"Select an account first."}>
      <SendTxnLink
        to={ROUTES.SEND_TXN.ASSETS.ROUTE}
        content={{
          label: "Assets",
          name: selectedAsset?.name || "",
          icon: selectedAsset && (
            <AssetLogo
              src={getAssetImgSrc(selectedAsset)}
              assetName={selectedAsset.name}
              size={20}
            />
          ),
          placeholder: "Not Selected"
        }}
        options={{
          description: selectedAsset ? formatASAAmount(selectedAsset) : "",
          placeholder: "Select asset"
        }}
        isDisabled={!senderAddress}
      />
    </Tooltip.Optional>
  );
}

export default SendTxnAssetLink;
