// eslint-disable-next-line @typescript-eslint/no-empty-function
export const NO_OP = () => {};

function generateNumberArray(length: number): number[] {
  return Array.from({length}, (_, index) => index);
}

/**
 * Replace an array item at the provided index with the provided newItem
 */
function replaceAtIndex<Item>(items: Item[], index: number, newItem: Item): Item[] {
  const newItems = [...items];

  newItems.splice(index, 1, newItem);

  return newItems;
}

/**
 * Filter out an array of items if they exist within another array by checking with the key provided
 */
function filterOutItemsByKey<T extends {[x: string]: any}>(
  filterOptions: {
    items: T[];
    key: keyof T;
  },
  array: T[]
): T[] {
  const itemsToFilterOut = filterOptions.items.map((item) => item[filterOptions.key]);

  return array.reduce<T[]>((finalArray, item) => {
    if (!itemsToFilterOut.includes(item[filterOptions.key])) {
      finalArray.push(item);
    }

    return finalArray;
  }, []);
}

/**
 * Randomize array items' index
 *
 * Fisher-Yates Shuffle - https://bost.ocks.org/mike/shuffle/
 */
function shuffleArray<T = any>(array: T[]): T[] {
  const newArray = [...array];
  let cursorIndex = newArray.length;
  let randomIndex: number;

  while (cursorIndex !== 0) {
    randomIndex = Math.floor(Math.random() * cursorIndex);
    cursorIndex = cursorIndex - 1;

    [newArray[cursorIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[cursorIndex]
    ];
  }

  return newArray;
}

function sortAlphabetically<T = any>(array: T[], compareKey: keyof T) {
  array.sort((firstItem, secondItem) => {
    let order = 0;

    if (firstItem[compareKey] < secondItem[compareKey]) {
      order = -1;
    } else if (firstItem[compareKey] > secondItem[compareKey]) {
      order = 1;
    }

    return order;
  });

  return array;
}

function generateKeyMapFromArray<T = Record<string, unknown>>(array: T[], key: keyof T) {
  if (array.length === 0) return {};

  return Object.fromEntries(array.map((item) => [item[key], item]));
}

export {
  generateKeyMapFromArray,
  generateNumberArray,
  replaceAtIndex,
  filterOutItemsByKey,
  shuffleArray,
  sortAlphabetically
};
