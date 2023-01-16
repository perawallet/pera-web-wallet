import "./_selectable-account-list.scss";

import {useCallback, useEffect} from "react";
import {CheckboxInput, List} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import SelectableListItem from "../../../../component/list/selectable-list-item/SelectableListItem";
import useFormito from "../../../../core/util/hook/formito/useFormito";
import Button from "../../../../component/button/Button";
import AccountListItemContent from "../../account-list/account-list-item-content/AccountListItemContent";
import {useAppContext} from "../../../../core/app/AppContext";
import {trimAccountAddress, trimAccountName} from "../../../util/accountUtils";
import {PortfolioOverview} from "../../../../overview/util/hook/usePortfolioOverview";

type ConditionalSelectableAccountListPropTypes =
  | {
      isMultipleSelect: true;
      onSelect: (selectedAccounts: Record<AppDBAccount["address"], boolean>) => void;
    }
  | {
      isMultipleSelect?: false;
      onSelect: (accountAddress: string) => void;
    };

type SelectableAccountListProps = ConditionalSelectableAccountListPropTypes & {
  accounts: PortfolioOverview["accounts"];
  toggleAllCheckboxContent?: React.ReactNode;
  isInitiallyAllChecked?: boolean;
  customClassName?: string;
};

function SelectableAccountList({
  accounts,
  onSelect,
  isMultipleSelect,
  toggleAllCheckboxContent,
  isInitiallyAllChecked = false,
  customClassName
}: SelectableAccountListProps) {
  const {
    state: {accounts: contextAccounts}
  } = useAppContext();
  const {formitoState, dispatchFormitoAction} = useFormito(
    generateInitialSelectAccountsFormitoState(isInitiallyAllChecked)
  );
  const selectableAccountListClassname = classNames(
    "selectable-account-list",
    customClassName,
    {
      "selectable-account-list__multiple-select": isMultipleSelect
    }
  );

  const handleAccountSelect = useCallback(
    (id: string, isChecked: boolean) => {
      if (isMultipleSelect) {
        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {[id]: isChecked}
        });
      } else {
        onSelect(id);
      }
    },
    [isMultipleSelect, dispatchFormitoAction, onSelect]
  );

  useEffect(() => {
    if (isMultipleSelect) {
      onSelect(formitoState);
    }
  }, [formitoState, isMultipleSelect, onSelect]);

  return (
    <div className={selectableAccountListClassname}>
      {isMultipleSelect && toggleAllCheckboxContent && (
        <div
          className={
            "selectable-account-list__select-all-checkbox-wrapper align-center--horizontally"
          }>
          <CheckboxInput
            customClassName={"selectable-account-list__select-all-checkbox"}
            isSelected={checkIfAllAccountsChecked()}
            onSelect={handleToggleAll}
            item={{
              id: "select-all",
              content: (
                <Button
                  buttonType={"ghost"}
                  onClick={handleToggleAll}
                  customClassName={"selectable-account-list__select-all-button"}>
                  {checkIfAllAccountsChecked() ? "Unselect all" : "Select all"}
                </Button>
              ),
              inputProps: {htmlFor: "select-all", name: "select-all", value: ""}
            }}
          />

          {toggleAllCheckboxContent}
        </div>
      )}

      <ul className={"selectable-account-list__list"}>
        <List items={accounts}>
          {(account) => (
            <SelectableListItem
              key={account.address}
              id={account.address}
              isSelected={formitoState[account.address]}
              onSelect={handleAccountSelect}
              shouldShowCheckbox={!!isMultipleSelect}
              customClassName={"selectable-account-list__list-item"}>
              <AccountListItemContent
                name={
                  trimAccountName(contextAccounts[account.address]?.name) ||
                  trimAccountAddress(account.address)
                }
                address={account.address}
                balance={account.total_algo_value}
              />
            </SelectableListItem>
          )}
        </List>
      </ul>
    </div>
  );

  function generateInitialSelectAccountsFormitoState(initialSelectedStatus: boolean) {
    const initialState = {} as Record<AppDBAccount["address"], boolean>;

    for (const account of Object.values(accounts)) {
      initialState[account.address] = initialSelectedStatus;
    }
    return initialState;
  }

  function handleToggleAll() {
    dispatchFormitoAction({
      type: "RESET_FORM_STATE",
      state: generateInitialSelectAccountsFormitoState(!checkIfAllAccountsChecked())
    });
  }

  function checkIfAllAccountsChecked() {
    return Object.values(formitoState).every(Boolean);
  }
}

export default SelectableAccountList;
