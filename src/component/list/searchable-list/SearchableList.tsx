import {ReactComponent as SearchIcon} from "../../../core/ui/icons/search.svg";

import "./_searchable-list.scss";

import {
  FormField,
  TypeaheadInput,
  List,
  ListProps,
  TypeaheadInputProps
} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import SimpleLoader from "../../loader/simple/SimpleLoader";

type SearchableListProps<Item = any> = Omit<ListProps, "items"> & {
  typeaheadSearchProps: TypeaheadInputProps;
} & {
  items: Item[];
  shouldDisplaySpinner?: boolean;
};

const MAX_VISIBLE_LIST_ITEMS = 100;

function SearchableList(props: SearchableListProps) {
  const {
    children,
    typeaheadSearchProps,
    shouldDisplaySpinner = false,
    items,
    customClassName,
    ...listProps
  } = props;

  return (
    <div className={classNames("searchable-list-container", customClassName)}>
      <FormField customClassName={"searchable-list__search"}>
        <TypeaheadInput
          leftIcon={<SearchIcon width={20} height={20} />}
          rightIcon={shouldDisplaySpinner && <SimpleLoader />}
          {...typeaheadSearchProps}
        />
      </FormField>

      {items.length > 0 ? (
        <List
          // limit visible items to prevent app crashes
          items={items.slice(0, MAX_VISIBLE_LIST_ITEMS)}
          customClassName={"searchable-list"}
          {...listProps}>
          {(...listItemProps) => children(...listItemProps)}
        </List>
      ) : (
        <div className={"searchable-list"} />
      )}
    </div>
  );
}

export default SearchableList;
