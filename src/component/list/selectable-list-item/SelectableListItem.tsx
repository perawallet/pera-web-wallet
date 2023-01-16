import "./_selectable-list-item.scss";

import {ListItem, ListItemProps, CheckboxInputProps} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import CheckboxInput from "../../checkbox/Checkbox";
import {NO_OP} from "../../../core/util/array/arrayUtils";

export interface SelectableListItemProps
  extends Omit<ListItemProps, "clickableListItemProps">,
    Omit<CheckboxInputProps, "item" | "onSelect"> {
  id: string;
  onSelect: (id: string, isChecked: boolean) => void;
  shouldShowCheckbox?: boolean;
}

function SelectableListItem(props: SelectableListItemProps) {
  const {
    id,
    children,
    isSelected,
    onSelect,
    shouldShowCheckbox = false,
    customClassName,
    ...otherProps
  } = props;
  const selectableListItemClassname = classNames(
    "selectable-list-item",
    customClassName,
    {"selectable-list-item__with-checkbox": shouldShowCheckbox}
  );

  return (
    <ListItem
      clickableListItemProps={{onClick: handleOnSelect}}
      customClassName={selectableListItemClassname}
      {...otherProps}>
      {shouldShowCheckbox && (
        <CheckboxInput
          customClassName={"selectable-list-item__checkbox-input"}
          isSelected={isSelected}
          onSelect={NO_OP}
          item={{
            id,
            content: "",
            inputProps: {
              name: `selectable-list-item__checkbox--${id}`,
              htmlFor: `selectable-list-item__checkbox--${id}`,
              value: isSelected ? id : ""
            }
          }}
        />
      )}

      {children}
    </ListItem>
  );

  function handleOnSelect() {
    return onSelect(id, !isSelected);
  }
}

export default SelectableListItem;
