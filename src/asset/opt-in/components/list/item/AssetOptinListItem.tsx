import {ReactComponent as CheckmarkIcon} from "../../../../../core/ui/icons/checkmark.svg";
import {ReactComponent as PlusIcon} from "../../../../../core/ui/icons/plus.svg";

import "./_asset-optin-list-item.scss";

import {useEffect, useState} from "react";

import Button from "../../../../../component/button/Button";
import {useModalDispatchContext} from "../../../../../component/modal/context/ModalContext";
import AssetListItem from "../../../../components/list/item/AssetListItem";
import AssetOptinConfirmationModal, {
  ASSET_OPTIN_CONFIRMATION_MODAL_ID
} from "../../../modal/confirmation/AssetOptinConfirmationModal";
import {useSimpleToaster} from "../../../../../component/simple-toast/util/simpleToastHooks";
import {NO_OP} from "../../../../../core/util/array/arrayUtils";
import {usePortfolioContext} from "../../../../../overview/context/PortfolioOverviewContext";
import useTxnSigner from "../../../../../core/util/hook/useTxnSigner";
import {assetDBManager} from "../../../../../core/app/db";

interface AssetOptinListItemProps {
  asset: Asset;
  address: string;
  signer: ReturnType<typeof useTxnSigner>;
}

function AssetOptinListItem({asset, address, signer}: AssetOptinListItemProps) {
  const dispatchModalStateAction = useModalDispatchContext();
  const [optinState, setOptinState] = useState<"not-started" | "pending" | "done">(
    "not-started"
  );
  const account = usePortfolioContext()!.accounts[address];
  const simpleToaster = useSimpleToaster();
  const accountPortfolioBalance = account ? parseFloat(account.total_algo_value) : 0;

  useEffect(() => {
    assetDBManager.getAllByAccountAddress(address).then((assets) => {
      if (assets.some(({asset_id}) => asset_id === asset.asset_id)) {
        setOptinState("done");

        simpleToaster.display({
          message: `${asset.unit_name} successfully added to your account`,
          type: "success"
        });
      }
    });
  }, [address, asset.asset_id, asset.unit_name, simpleToaster]);

  return (
    <AssetListItem
      asset={asset}
      rightSide={
        <Button
          buttonType={"light"}
          onClick={handleOptinClick}
          isDisabled={optinState === "done"}
          shouldHideChildrenOnSpinnerView={true}
          shouldDisplaySpinner={optinState === "pending"}
          customClassName={"asset-optin-list-item__optin-button"}>
          {optinState === "done" ? <CheckmarkIcon width={16} /> : <PlusIcon width={16} />}
        </Button>
      }
      onSelect={NO_OP}
      customClassName={"asset-optin-list-item"}
    />
  );

  function handleOptinClick() {
    if (accountPortfolioBalance > 0) {
      dispatchModalStateAction({
        type: "OPEN_MODAL",
        payload: {
          item: {
            id: ASSET_OPTIN_CONFIRMATION_MODAL_ID,
            children: (
              <AssetOptinConfirmationModal
                asset={asset}
                account={account}
                onApprove={handleApproveOptin}
                onClose={closeConfirmationModal}
              />
            ),
            modalContentLabel: "Opt-in to asset"
          }
        }
      });
    } else {
      simpleToaster.display({
        message: "Balance too low to cover transaction fee",
        type: "error"
      });
    }
  }

  async function handleApproveOptin() {
    if (!signer) return;

    try {
      setOptinState("pending");

      closeConfirmationModal();

      await signer
        .optInTxn({address: account.address, assetIndex: asset.asset_id})
        .sign(account.address, {sendNetwork: true});
    } catch (error) {
      console.error(error);

      setOptinState("not-started");

      simpleToaster.display({
        message: `Couldn’t add ${asset.unit_name} to your account. Please try again.`,
        type: "error"
      });
    }
  }

  function closeConfirmationModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {
        id: ASSET_OPTIN_CONFIRMATION_MODAL_ID
      }
    });
  }
}

export default AssetOptinListItem;
