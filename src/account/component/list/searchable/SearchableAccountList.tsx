import "./_searchable-account-list.scss";

import {useState} from "react";
import classNames from "classnames";

import SearchableList from "../../../../component/list/searchable-list/SearchableList";
import SelectableListItem from "../../../../component/list/selectable-list-item/SelectableListItem";
import {useAppContext} from "../../../../core/app/AppContext";
import AccountListItemContent from "../../account-list/account-list-item-content/AccountListItemContent";
import EmptyAccountList from "../empty/EmptyAccountList";

interface SearchableAccountListProps {
  accounts: AccountOverview[];
  onSelectAccount: (address: string) => void;
  hasBackgroundColor: boolean;
  customClassName?: string;
  shouldDisplayMinBalanceWarning?: boolean;
}

function SearchableAccountList({
  accounts: searchableAccounts,
  onSelectAccount,
  customClassName,
  hasBackgroundColor: hasBackgroundColor,
  shouldDisplayMinBalanceWarning = false
}: SearchableAccountListProps) {
  const [filteredAccounts, setFilteredAccounts] =
    useState<AccountOverview[]>(searchableAccounts);
  const {
    state: {hasAccounts}
  } = useAppContext();
  const searchableAccountListClassName = classNames(
    `searchable-account-list`,
    customClassName,
    {
      "searchable-account-list--colored-background": hasBackgroundColor
    }
  );

  if (!hasAccounts) return <EmptyAccountList />;

  return (
    <SearchableList
      customClassName={searchableAccountListClassName}
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
            account={account}
            shouldDisplayMinBalanceWarning={shouldDisplayMinBalanceWarning}
          />
        </SelectableListItem>
      )}
    </SearchableList>
  );

  function handleFilterAccount(value: string) {
    const query = value.toLowerCase();
    const queriedAccounts = searchableAccounts.filter(
      ({address, name: accountName, domainName}) =>
        [accountName, domainName?.name, address].some(
          (text) => text && text.toLowerCase().includes(query)
        )
    );

    setFilteredAccounts(
      queriedAccounts.length > 0 ? queriedAccounts : searchableAccounts
    );
  }
}

export default SearchableAccountList;
