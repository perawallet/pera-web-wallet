import "./_asset-optin-select-account.scss";

import {useNavigate} from "react-router-dom";

import GoBackButton from "../../../../component/go-back-button/GoBackButton";
import {usePortfolioContext} from "../../../../overview/context/PortfolioOverviewContext";
import ROUTES from "../../../../core/route/routes";
import {ASSET_OPTIN_PAGE_SEARCH_PARAM} from "../AssetOptinPage";
import SearchableAccountList from "../../../../account/component/list/searchable/SearchableAccountList";

function AssetOptinSelectAccount() {
  const portfolioOverview = usePortfolioContext();
  const navigate = useNavigate();

  return (
    <div className={"asset-optin-select-account"}>
      <GoBackButton
        text={"Select Account"}
        customClassName={"asset-optin-select-account__go-back-button"}
      />

      <SearchableAccountList
        hasBackgroundColor={true}
        accounts={Object.values(portfolioOverview.accounts)}
        onSelectAccount={handleSelectAccount}
      />
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
