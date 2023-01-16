/* eslint-disable no-magic-numbers */
import "./_asset-optin-confirmation-modal.scss";

import {List, ListItem} from "@hipo/react-ui-toolkit";
import {useEffect, useState} from "react";
import {Transaction} from "algosdk";
import classNames from "classnames";

import AssetLogo from "../../../components/logo/AssetLogo";
import {isNFT, renderVerificationTierIcon} from "../../../../core/util/asset/assetUtils";
import ClipboardButton from "../../../../component/clipboard/button/ClipboardButton";
import {getAccountIcon, trimAccountName} from "../../../../account/util/accountUtils";
import {ALGO_UNIT} from "../../../../core/ui/typography/typographyConstants";
import {defaultPriceFormatter} from "../../../../core/util/number/numberUtils";
import Button from "../../../../component/button/Button";
import {generateAssetOptinTxn} from "../../util/assetOptinUtils";
import {getAssetImgSrc} from "../../../../core/util/image/imageUtils";

interface AssetOptinConfirmationModalProps {
  asset: Asset;
  account: AppDBAccount;
  onApprove: (txn: Transaction) => void;
  onClose: VoidFunction;
}

export const ASSET_OPTIN_CONFIRMATION_MODAL_ID = "asset-optin-confirmation-modal-id";

function AssetOptinConfirmationModal({
  asset,
  account,
  onApprove,
  onClose
}: AssetOptinConfirmationModalProps) {
  const {algoFormatter} = defaultPriceFormatter();
  const [optinTxn, setOptinTxn] = useState<Transaction | undefined>();

  useEffect(() => {
    (async () => {
      const assetOptinTxn = await generateAssetOptinTxn(account.address, asset.asset_id);

      setOptinTxn(assetOptinTxn);
    })();
  }, [account, asset.asset_id]);

  return (
    <div className={"asset-optin-confirmation-modal"}>
      <h2 className={"typography--h2 text-color--main text--centered"}>{"Opt-in"}</h2>

      <div className={"asset-optin-confirmation-modal__asset"}>
        <AssetLogo
          src={getAssetImgSrc(asset, 112, 112)}
          assetName={asset.name}
          size={56}
          customClassName={classNames({
            "asset-optin-confirmation-modal__logo--is-nft": isNFT(asset)
          })}
        />

        <div className={"asset-optin-confirmation-modal__asset-name"}>
          <h1 className={"typography--h1 text-color--main"}>{asset.name}</h1>

          {renderVerificationTierIcon(asset, 24)}
        </div>

        <p className={"typography--secondary-body text-color--gray"}>{asset.unit_name}</p>
      </div>

      <List
        items={getOptinInfoItems()}
        customClassName={"asset-optin-confirmation-modal__info-list"}>
        {({title, content}) => (
          <ListItem customClassName={"asset-optin-confirmation-modal__info-list-item"}>
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
        customClassName={"button--fluid asset-optin-confirmation-modal__approve-cta"}
        type={"submit"}
        onClick={handleApproveOptin}>
        {"Approve"}
      </Button>

      <Button
        buttonType={"ghost"}
        size={"large"}
        customClassName={"button--fluid"}
        onClick={onClose}>
        {"Close"}
      </Button>
    </div>
  );

  function getOptinInfoItems() {
    return [
      {
        title: "ID",
        content: (
          <div className={"asset-optin-confirmation-modal__info-list-item__content"}>
            <p className={"typography--medium-body text-color--main"}>{asset.asset_id}</p>

            <ClipboardButton
              buttonType={"ghost"}
              customClassName={"asset-optin-confirmation-modal__copy-button"}
              textToCopy={String(asset.asset_id)}
            />
          </div>
        )
      },
      {
        title: "Account",
        content: (
          <div className={"asset-optin-confirmation-modal__info-list-item__content"}>
            {getAccountIcon({type: account.type, width: 24, height: 24})}

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
            {optinTxn ? `${ALGO_UNIT}${algoFormatter(optinTxn.fee)}` : "-"}
          </p>
        )
      }
    ];
  }

  function handleApproveOptin() {
    if (optinTxn) {
      onApprove(optinTxn);
    }
  }
}

export default AssetOptinConfirmationModal;
