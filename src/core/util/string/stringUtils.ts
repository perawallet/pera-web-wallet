function encodeString(text: string) {
  return new TextEncoder().encode(text);
}

/**
 * @param options Options
 * @returns A randomly generated string
 */
function generateRandomString(options?: {radix?: number; substringStartIndex?: number}) {
  // eslint-disable-next-line no-magic-numbers
  const {radix = 36, substringStartIndex = 7} = options || {};

  return Math.random().toString(radix).substring(substringStartIndex);
}

export {encodeString, generateRandomString};
