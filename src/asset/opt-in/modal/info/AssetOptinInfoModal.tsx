import {ReactComponent as OptinIcon} from "../../../../core/ui/icons/opt-in.svg";

import "./_asset-optin-info-modal.scss";

import {useNavigate} from "react-router-dom";

import {
  ASSET_OPTIN_INFO_MODAL_ID,
  ASSET_OPTIN_INFO_MODAL_TIPS
} from "./util/assetOptinInfoModalConstants";
import {STORED_KEYS} from "../../../../core/util/storage/web/webStorage";
import ROUTES from "../../../../core/route/routes";
import {ASSET_OPTIN_PAGE_SEARCH_PARAM} from "../../page/AssetOptinPage";
import InfoModal from "../../../../component/info-modal/InfoModal";

interface AssetOptinInfoModalProps {
  account?: AppDBAccount;
  displayDontShowAgain?: boolean;
}

function AssetOptinInfoModal({
  account,
  displayDontShowAgain = false
}: AssetOptinInfoModalProps) {
  const navigate = useNavigate();

  return (
    <InfoModal
      modalId={ASSET_OPTIN_INFO_MODAL_ID}
      title={"Opt-in to asset"}
      onConfirm={navigateToAssetOptinPage}
      customClassName={"asset-optin-page__info-modal"}
      iconHeader={<OptinIcon width={48} height={48} />}
      infoItems={ASSET_OPTIN_INFO_MODAL_TIPS}
      displayDontShowAgain={
        displayDontShowAgain
          ? {
              webStorageKey: STORED_KEYS.HIDE_ASSET_OPTIN_INFO_MODAL
            }
          : undefined
      }
    />
  );

  function navigateToAssetOptinPage() {
    if (!account) return;

    navigate({
      pathname: ROUTES.ASSET_OPTIN.ROUTE,
      search: `?${ASSET_OPTIN_PAGE_SEARCH_PARAM}=${account?.address}`
    });
  }
}

export default AssetOptinInfoModal;
