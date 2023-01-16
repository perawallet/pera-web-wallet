import "./_account-overview-list.scss";

import {List} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import AccountOverviewListItem from "./account-overview-list-item/AccountOverviewListItem";
import {PortfolioOverview} from "../../../util/hook/usePortfolioOverview";
import {sortAlphabetically} from "../../../../core/util/array/arrayUtils";

export interface AccountOverviewListProps {
  accounts: PortfolioOverview["accounts"];
  className?: string;
}

function AccountOverviewList({accounts, className}: AccountOverviewListProps) {
  const accountOverviewListClassname = classNames("account-overview-list", className);

  return (
    <List
      listItemKeyGenerator={listItemKeyGenerator}
      customClassName={accountOverviewListClassname}
      items={sortAlphabetically(accounts, "name")}>
      {({
        total_usd_value,
        total_algo_value,
        address,
        standard_asset_count,
        collectible_count
      }) => (
        <AccountOverviewListItem
          accountUSDValue={total_usd_value}
          accountALGOValue={total_algo_value}
          address={address}
          assetCount={standard_asset_count}
          collectibleCount={collectible_count}
        />
      )}
    </List>
  );

  function listItemKeyGenerator(item: PortfolioOverview["accounts"][number]) {
    return item.address;
  }
}

export default AccountOverviewList;
