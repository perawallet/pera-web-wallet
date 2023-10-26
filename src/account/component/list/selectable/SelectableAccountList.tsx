import "./_selectable-account-list.scss";

import {List} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import SelectableListItem from "../../../../component/list/selectable-list-item/SelectableListItem";
import AccountListItemContent, {
  AccountListItemContentProps
} from "../../account-list/account-list-item-content/AccountListItemContent";

export type SelectableAccountListProps = {
  accounts: AccountListItemContentProps["account"][];
  onSelect: (accountAddress: string) => void;
  customClassName?: string;
};

function SelectableAccountList({
  accounts,
  onSelect,
  customClassName
}: SelectableAccountListProps) {
  const selectableAccountListClassname = classNames(
    "selectable-account-list",
    customClassName
  );

  return (
    <div className={selectableAccountListClassname}>
      <List items={accounts} customClassName={"selectable-account-list__list"}>
        {(account) => (
          <SelectableListItem
            key={account.address}
            id={account.address}
            isSelected={false}
            onSelect={onSelect}
            shouldShowCheckbox={false}
            customClassName={"selectable-account-list__list-item"}>
            <AccountListItemContent account={account} />
          </SelectableListItem>
        )}
      </List>
    </div>
  );
}

export default SelectableAccountList;
