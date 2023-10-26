/* eslint-disable no-magic-numbers */
import "./_add-funds-opt-in-modal.scss";

import {List, ListItem} from "@hipo/react-ui-toolkit";
import {useEffect, useState} from "react";
import classNames from "classnames";

import {defaultPriceFormatter} from "../../core/util/number/numberUtils";
import {useSimpleToaster} from "../../component/simple-toast/util/simpleToastHooks";
import Button from "../../component/button/Button";
import {trimAccountName} from "../../account/util/accountUtils";
import {ALGO_UNIT} from "../../core/ui/typography/typographyConstants";
import AssetLogo from "../../asset/components/logo/AssetLogo";
import {isNFT, renderVerificationTierIcon} from "../../core/util/asset/assetUtils";
import ClipboardButton from "../../component/clipboard/button/ClipboardButton";
import {getAssetImgSrc} from "../../core/util/image/imageUtils";
import useAsyncProcess from "../../core/network/async-process/useAsyncProcess";
import {peraApi} from "../../core/util/pera/api/peraApi";
import SimpleLoader from "../../component/loader/simple/SimpleLoader";
import {useModalDispatchContext} from "../../component/modal/context/ModalContext";
import useAddFunds from "../../core/util/hook/useAddFunds";
import useTxnSigner from "../../core/util/hook/useTxnSigner";
import {usePortfolioContext} from "../../overview/context/PortfolioOverviewContext";
import useAccountIcon from "../../core/util/hook/useAccountIcon";

interface AssetOptinConfirmationModalProps {
  assetID: string;
  address: string;
}

export const ADD_FUNDS_OPT_IN_MODAL_ID = "asset-optin-confirmation-modal-id";

function AddFundsOptinModal({assetID, address}: AssetOptinConfirmationModalProps) {
  const {algoFormatter} = defaultPriceFormatter();
  const [optinState, setOptinState] = useState<"not-started" | "pending">("not-started");
  const simpleToaster = useSimpleToaster();
  const {
    state: {data: assetData, isRequestPending},
    runAsyncProcess
  } = useAsyncProcess<ListRequestResponse<Asset>>();
  const asset = assetData?.results[0];
  const dispatchModalStateAction = useModalDispatchContext();
  const {open: openAddFundsModal} = useAddFunds();
  const account = usePortfolioContext()!.accounts[address];
  const signer = useTxnSigner();
  const {renderAccountIcon} = useAccountIcon();

  useEffect(() => {
    const abortController = new AbortController();

    runAsyncProcess(
      peraApi.getAssets({asset_ids: assetID}, {signal: abortController.signal})
    );

    return () => abortController.abort();
  }, [runAsyncProcess, assetID]);

  if (isRequestPending) {
    return (
      <div className={"add-funds-optin-modal--spinner"}>
        <SimpleLoader />
      </div>
    );
  }

  if (!asset) {
    return null;
  }

  return (
    <div className={"add-funds-optin-modal"}>
      <h2 className={"typography--h2 text-color--main text--centered"}>{"Opt-in"}</h2>

      <div className={"add-funds-optin-modal__asset"}>
        <AssetLogo
          src={getAssetImgSrc(asset, 112, 112)}
          assetName={asset.name}
          size={56}
          customClassName={classNames({
            "add-funds-optin-modal__logo--is-nft": isNFT(asset)
          })}
        />

        <div className={"add-funds-optin-modal__asset-name"}>
          <h1 className={"typography--h1 text-color--main"}>{asset.name}</h1>

          {renderVerificationTierIcon(asset, 24)}
        </div>

        <p className={"typography--secondary-body text-color--gray"}>{asset.unit_name}</p>
      </div>

      <List
        items={getOptinInfoItems()}
        customClassName={"add-funds-optin-modal__info-list"}>
        {({title, content}) => (
          <ListItem customClassName={"add-funds-optin-modal__info-list-item"}>
            <p className={"typography--body text-color--gray"}>{title}</p>

            {content}
          </ListItem>
        )}
      </List>

      <p className={"typography--body text-color--main"}>
        {
          "Adding an asset requires sending a transaction with a minimum transaction fee. This will appear on your transaction history."
        }
      </p>

      <Button
        buttonType={"primary"}
        size={"large"}
        customClassName={"button--fluid add-funds-optin-modal__approve-cta"}
        type={"submit"}
        shouldDisplaySpinner={optinState === "pending"}
        onClick={handleApproveOptin}>
        {"Approve"}
      </Button>

      <Button
        buttonType={"ghost"}
        size={"large"}
        customClassName={"button--fluid"}
        onClick={handleOnClose}>
        {"Close"}
      </Button>
    </div>
  );

  function getOptinInfoItems() {
    return [
      {
        title: "ID",
        content: (
          <div className={"add-funds-optin-modal__info-list-item__content"}>
            <p className={"typography--medium-body text-color--main"}>{assetID}</p>

            <ClipboardButton
              buttonType={"ghost"}
              customClassName={"add-funds-optin-modal__copy-button"}
              textToCopy={String(assetID)}
            />
          </div>
        )
      },
      {
        title: "Account",
        content: (
          <div className={"add-funds-optin-modal__info-list-item__content"}>
            {renderAccountIcon({account, size: 24})}

            <p className={"typography--medium-body text-color--main"}>
              {trimAccountName(account.name)}
            </p>
          </div>
        )
      },
      {
        title: "Transaction Fee",
        content: (
          <p className={"typography--medium-body text-color--main"}>
            {signer ? `${ALGO_UNIT}${algoFormatter(signer.getSuggestedFee())}` : "-"}
          </p>
        )
      }
    ];
  }

  async function handleApproveOptin() {
    if (signer) {
      setOptinState("pending");

      try {
        await signer
          .optInTxn({address: account.address, assetIndex: asset!.asset_id})
          .sign(account.address, {sendNetwork: true});

        simpleToaster.display({
          message: `${asset!.unit_name} successfully added to your account`,
          type: "success"
        });

        handleOnClose();

        openAddFundsModal(account.address);

        setOptinState("not-started");
      } catch (error) {
        if (parseFloat(account.total_algo_value) > 0) {
          simpleToaster.display({
            message: `Couldn’t add ${
              asset!.unit_name
            } to your account. Please try again.`,
            type: "error"
          });
        } else {
          simpleToaster.display({
            message: "Balance too low to cover transaction fee",
            type: "error"
          });
        }

        handleOnClose();
        setOptinState("not-started");
      }
    }
  }

  function handleOnClose() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {
        id: ADD_FUNDS_OPT_IN_MODAL_ID
      }
    });
  }
}

export default AddFundsOptinModal;
