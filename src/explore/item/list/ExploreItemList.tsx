import "./_explore-item-list.scss";

import {List, ListItem} from "@hipo/react-ui-toolkit";

import ExploreItemCard from "../card/ExploreItemCard";

interface ExploreItemListProps {
  items: ExploreItem[];
}

function ExploreItemList({items}: ExploreItemListProps) {
  return (
    <List items={items} customClassName={"explore-item-list"}>
      {(item) => (
        <ListItem>
          <ExploreItemCard item={item} />
        </ListItem>
      )}
    </List>
  );
}

export default ExploreItemList;
