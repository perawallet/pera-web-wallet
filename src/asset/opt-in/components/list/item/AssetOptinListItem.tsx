import {ReactComponent as CheckmarkIcon} from "../../../../../core/ui/icons/checkmark.svg";
import {ReactComponent as PlusIcon} from "../../../../../core/ui/icons/plus.svg";

import "./_asset-optin-list-item.scss";

import {useState} from "react";
import algosdk, {Transaction} from "algosdk";

import Button from "../../../../../component/button/Button";
import {useModalDispatchContext} from "../../../../../component/modal/context/ModalContext";
import AssetListItem from "../../../../components/list/item/AssetListItem";
import AssetOptinConfirmationModal, {
  ASSET_OPTIN_CONFIRMATION_MODAL_ID
} from "../../../modal/confirmation/AssetOptinConfirmationModal";
import algod from "../../../../../core/util/algod/algod";
import {decryptSK} from "../../../../../core/util/nacl/naclUtils";
import {useAppContext} from "../../../../../core/app/AppContext";
import {useSimpleToaster} from "../../../../../component/simple-toast/util/simpleToastHooks";
import {NO_OP} from "../../../../../core/util/array/arrayUtils";
import {usePortfolioContext} from "../../../../../overview/context/PortfolioOverviewContext";
import {ALGORAND_DEFAULT_TXN_WAIT_ROUNDS} from "../../../../../send-txn/util/sendTxnConstants";

interface AssetOptinListItemProps {
  asset: Asset;
  account: AppDBAccount;
}

function AssetOptinListItem({asset, account}: AssetOptinListItemProps) {
  const dispatchModalStateAction = useModalDispatchContext();
  const [optinState, setOptinState] = useState<"not-started" | "pending" | "done">(
    "not-started"
  );
  const accountPortfolio = usePortfolioContext()?.accounts.find(
    (portfolioAccount) => portfolioAccount.address === account.address
  );
  const {
    state: {accounts, masterkey}
  } = useAppContext();
  const simpleToaster = useSimpleToaster();
  const accountPortfolioBalance = accountPortfolio
    ? parseFloat(accountPortfolio.total_algo_value)
    : 0;

  return (
    <AssetListItem
      asset={asset}
      rightSide={
        <Button
          buttonType={"secondary"}
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
                account={accounts[account.address]}
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

  async function handleApproveOptin(optinTxn: Transaction) {
    setOptinState("pending");

    closeConfirmationModal();

    try {
      // Decrypt secret_key and sign Opt-in txn
      const sk = await decryptSK(account.pk, masterkey!);
      const signedOptinTxn = optinTxn.signTxn(sk!);

      // Send txn to network
      await algod.client.sendRawTransaction(signedOptinTxn).do();
      await algosdk.waitForConfirmation(
        algod.client,
        optinTxn.txID().toString(),
        ALGORAND_DEFAULT_TXN_WAIT_ROUNDS
      );

      simpleToaster.display({
        message: `${asset.unit_name} successfully added to your account`,
        type: "success"
      });

      setOptinState("done");
    } catch (error) {
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
