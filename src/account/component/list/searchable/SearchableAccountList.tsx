import "./_searchable-account-list.scss";

import {useState} from "react";
import classNames from "classnames";

import SearchableList from "../../../../component/list/searchable-list/SearchableList";
import SelectableListItem from "../../../../component/list/selectable-list-item/SelectableListItem";
import {useAppContext} from "../../../../core/app/AppContext";
import {PortfolioOverview} from "../../../../overview/util/hook/usePortfolioOverview";
import AccountListItemContent from "../../account-list/account-list-item-content/AccountListItemContent";
import EmptyAccountList from "../empty/EmptyAccountList";

interface SearchableAccountListProps {
  accounts: PortfolioOverview["accounts"];
  onSelectAccount: (address: string) => void;
  customClassName?: string;
}

function SearchableAccountList({
  accounts: searchableAccounts,
  onSelectAccount,
  customClassName
}: SearchableAccountListProps) {
  const [filteredAccounts, setFilteredAccounts] =
    useState<PortfolioOverview["accounts"]>(searchableAccounts);
  const {
    state: {accounts}
  } = useAppContext();
  const {
    state: {hasAccounts}
  } = useAppContext();

  if (!hasAccounts) return <EmptyAccountList />;

  return (
    <SearchableList
      customClassName={classNames("searchable-account-list", customClassName)}
      items={filteredAccounts}
      typeaheadSearchProps={{
        name: "filterAccountQuery",
        placeholder: "Search account",
        onQueryChange: handleFilterAccount,
        queryChangeDebounceTimeout: 300
      }}>
      {(account: AccountOverview) => (
        <SelectableListItem
          id={account.address}
          isSelected={false}
          onSelect={onSelectAccount}
          customClassName={"searchable-account-list-item"}>
          <AccountListItemContent
            name={accounts[account.address]?.name || ""}
            address={account.address}
            balance={account.total_algo_value}
            accountType={accounts[account.address].type}
          />
        </SelectableListItem>
      )}
    </SearchableList>
  );

  function handleFilterAccount(value: string) {
    const query = value.toLowerCase();
    const queriedAccounts = searchableAccounts.filter(
      (account) =>
        account.address.toLowerCase().includes(query) ||
        (account?.accountName && account.accountName.toLowerCase().includes(query))
    );

    setFilteredAccounts(queriedAccounts);
  }
}

export default SearchableAccountList;
