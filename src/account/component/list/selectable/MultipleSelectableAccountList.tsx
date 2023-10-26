import "./_selectable-account-list.scss";

import {ReactComponent as ChevronDownIcon} from "../../../../core/ui/icons/chevron-down.svg";

import {SyntheticEvent, useState} from "react";
import {CheckboxInput, List} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import SelectableListItem from "../../../../component/list/selectable-list-item/SelectableListItem";
import Button from "../../../../component/button/Button";
import AccountListItemContent from "../../account-list/account-list-item-content/AccountListItemContent";

export type MultipleSelectableAccountListProps = {
  accounts: AccountOverview[];
  onFormSubmit: (addresses: string[]) => void;
  toggleAllCheckboxContent?: React.ReactNode;
  shouldDisplayAssetDetails?: boolean;
  shouldDisplaySpinner?: boolean;
  onLoadMoreClick?: VoidFunction;
  isInitiallyAllChecked?: boolean;
  ctaText?: string;
  customClassName?: string;
};

function MultipleSelectableAccountList({
  accounts,
  toggleAllCheckboxContent,
  onFormSubmit,
  customClassName,
  onLoadMoreClick,
  ctaText = "Continue",
  shouldDisplayAssetDetails = false,
  shouldDisplaySpinner = false,
  isInitiallyAllChecked = false
}: MultipleSelectableAccountListProps) {
  const [selectState, setSelectState] = useState(
    generateInitialSelectState(isInitiallyAllChecked)
  );

  const isAllChecked = Object.values(selectState).every(Boolean);
  const isNonChecked = !Object.values(selectState).some(Boolean);

  const selectableAccountListClassname = classNames(
    "selectable-account-list",
    "selectable-account-list__multiple-select",
    customClassName
  );

  return (
    <>
      <div
        className={
          "selectable-account-list__select-all-checkbox-wrapper align-center--horizontally"
        }>
        <CheckboxInput
          customClassName={"selectable-account-list__select-all-checkbox"}
          isSelected={isAllChecked}
          onSelect={handleToggleAll}
          item={{
            id: "select-all",
            content: (
              <Button
                buttonType={"ghost"}
                onClick={handleToggleAll}
                customClassName={"selectable-account-list__select-all-button"}>
                {isAllChecked
                  ? "Unselect all"
                  : `Select All ${accounts.length ? `(${accounts.length})` : ""}`}
              </Button>
            ),
            inputProps: {htmlFor: "select-all", name: "select-all", value: ""}
          }}
        />

        {toggleAllCheckboxContent || ""}
      </div>

      <form className={selectableAccountListClassname} onSubmit={handleFormSubmit}>
        <List items={accounts} customClassName={"selectable-account-list__list"}>
          {(account) => (
            <SelectableListItem
              key={account.address}
              id={account.address}
              isSelected={selectState[account.address]}
              onSelect={handleAccountSelect}
              shouldShowCheckbox={true}
              customClassName={"selectable-account-list__list-item"}>
              <AccountListItemContent
                account={account}
                customDescription={getAccountAssetDescription(account)}
                shouldDisplayExplorerLink={true}
              />
            </SelectableListItem>
          )}
        </List>

        {!shouldDisplaySpinner && onLoadMoreClick && (
          <Button
            type={"button"}
            buttonType={"ghost"}
            size={"large"}
            customClassName={"selectable-account-list__load-more"}
            onClick={onLoadMoreClick}>
            {"Load more accounts"}

            <ChevronDownIcon />
          </Button>
        )}

        <Button
          size={"large"}
          type={"submit"}
          shouldDisplaySpinner={shouldDisplaySpinner}
          isDisabled={isNonChecked || shouldDisplaySpinner}
          customClassName={"selectable-account-list__cta"}>
          {ctaText}
        </Button>
      </form>
    </>
  );

  function handleFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData(event.currentTarget);

    onFormSubmit([...formData.values()] as string[]);
  }

  function handleAccountSelect(id: string, isChecked: boolean) {
    setSelectState((oldState) => ({...oldState, [id]: isChecked}));
  }

  function generateInitialSelectState(initialSelectedStatus: boolean) {
    const initialState = {} as Record<AppDBAccount["address"], boolean>;

    for (const account of Object.values(accounts)) {
      initialState[account.address] = initialSelectedStatus;
    }
    return initialState;
  }

  function handleToggleAll() {
    setSelectState(generateInitialSelectState(!isAllChecked));
  }

  function getAccountAssetDescription(account: AccountOverview) {
    if (!shouldDisplayAssetDetails) return undefined;

    const {standard_asset_count = 1, collectible_count: nftCount = 0} = account;
    const assetCount = standard_asset_count === 0 ? 1 : standard_asset_count;

    let description = `${assetCount} asset${assetCount > 1 ? "s" : ""}`;

    if (nftCount > 0) {
      description += `, ${nftCount} NFT${nftCount > 1 ? "s" : ""}`;
    }

    return description;
  }
}

export default MultipleSelectableAccountList;
