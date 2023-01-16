import {ReactComponent as InfoIcon} from "../../../core/ui/icons/info.svg";

import "./_asset-optin-page.scss";

import {useSearchParams} from "react-router-dom";

import {useAppContext} from "../../../core/app/AppContext";
import AssetOptinAccountLink from "../components/account-link/AssetOptinAccountLink";
import AssetOptinList from "../components/list/AssetOptinList";
import {getHighestBalanceAccount} from "../../../account/util/accountUtils";
import {usePortfolioContext} from "../../../overview/context/PortfolioOverviewContext";
import EmptyAccountList from "../../../account/component/list/empty/EmptyAccountList";
import Button from "../../../component/button/Button";
import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";
import AssetOptinInfoModal from "../modal/info/AssetOptinInfoModal";
import PeraLoader from "../../../component/loader/pera/PeraLoader";
import {ASSET_OPTIN_INFO_MODAL_ID} from "../modal/info/util/assetOptinInfoModalConstants";

export const ASSET_OPTIN_PAGE_SEARCH_PARAM = "address";

function AssetOptinPage() {
  const {
    state: {accounts}
  } = useAppContext();
  const dispatchModalStateAction = useModalDispatchContext();
  const portfolioOverview = usePortfolioContext();
  const highestBalanceAccount = getHighestBalanceAccount(
    portfolioOverview?.accounts || []
  );
  const [searchParams] = useSearchParams();

  if (!portfolioOverview) {
    return <PeraLoader mode={"gray"} customClassName={"pera-loader--align-center"} />;
  }

  const accountAddress =
    searchParams.get(ASSET_OPTIN_PAGE_SEARCH_PARAM) || highestBalanceAccount?.address;
  const account = accountAddress ? accounts[accountAddress!] : undefined;

  return (
    <div className={"asset-optin-page"}>
      <div className={"asset-optin-page__header"}>
        <h2 className={"typography--h2 text-color--main"}>{"Opt-in to Asset"}</h2>

        <Button
          onClick={handleInfoButtonClick}
          buttonType={"ghost"}
          customClassName={"asset-optin-page__info-button"}>
          <InfoIcon />
        </Button>
      </div>

      {account ? (
        <>
          <AssetOptinList account={account} />

          <AssetOptinAccountLink account={account} />
        </>
      ) : (
        <EmptyAccountList />
      )}
    </div>
  );

  function handleInfoButtonClick() {
    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: ASSET_OPTIN_INFO_MODAL_ID,
          modalContentLabel: "Opt-in to asset",
          children: <AssetOptinInfoModal />
        }
      }
    });
  }
}

export default AssetOptinPage;
