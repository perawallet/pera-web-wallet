import "./_account-overview-list.scss";

import {List} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import AccountOverviewListItem from "./account-overview-list-item/AccountOverviewListItem";
import {sortAlphabetically} from "../../../../core/util/array/arrayUtils";
import {usePortfolioContext} from "../../../context/PortfolioOverviewContext";

export interface AccountOverviewListProps {
  className?: string;
}

function AccountOverviewList({className}: AccountOverviewListProps) {
  const portfolioOverview = usePortfolioContext();
  const accountOverviewListClassname = classNames("account-overview-list", className);

  return (
    <List
      listItemKeyGenerator={listItemKeyGenerator}
      customClassName={accountOverviewListClassname}
      items={sortAlphabetically(Object.values(portfolioOverview!.accounts), "name")}>
      {(account) => <AccountOverviewListItem account={account} />}
    </List>
  );

  function listItemKeyGenerator(item: PortfolioOverview["accounts"][number]) {
    return item.address;
  }
}

export default AccountOverviewList;
