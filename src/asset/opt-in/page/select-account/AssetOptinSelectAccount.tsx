import "./_asset-optin-select-account.scss";

import {useNavigate} from "react-router-dom";

import GoBackButton from "../../../../component/go-back-button/GoBackButton";
import {usePortfolioContext} from "../../../../overview/context/PortfolioOverviewContext";
import ROUTES from "../../../../core/route/routes";
import {ASSET_OPTIN_PAGE_SEARCH_PARAM} from "../AssetOptinPage";
import SearchableAccountList from "../../../../account/component/list/searchable/SearchableAccountList";
import PeraLoader from "../../../../component/loader/pera/PeraLoader";

function AssetOptinSelectAccount() {
  const portfolioOverview = usePortfolioContext();
  const navigate = useNavigate();

  return (
    <div className={"asset-optin-select-account"}>
      <GoBackButton
        text={"Select Account"}
        customClassName={"asset-optin-select-account__go-back-button"}
      />

      {portfolioOverview ? (
        <SearchableAccountList
          accounts={portfolioOverview.accounts}
          onSelectAccount={handleSelectAccount}
        />
      ) : (
        <PeraLoader
          mode={"gray"}
          customClassName={"asset-optin-select-account__loader"}
        />
      )}
    </div>
  );

  function handleSelectAccount(address: string) {
    navigate({
      pathname: ROUTES.ASSET_OPTIN.ROUTE,
      search: `?${ASSET_OPTIN_PAGE_SEARCH_PARAM}=${address}`
    });
  }
}

export default AssetOptinSelectAccount;
