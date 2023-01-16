import exploreItems from "./exploreItems.json";

/**
 * Returns the explore items within the given category.
 * @param {string} category
 * @returns {ExploreItem[]} ExploreItem[]
 */
function getExploreItems(category?: string): ExploreItem[] {
  let items = exploreItems;

  if (category?.length) {
    // split by comma the categories and search each item
    items = items.filter((item) => item.category?.split(",").includes(category));
  }

  return items;
}

export {getExploreItems};
