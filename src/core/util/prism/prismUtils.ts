import {stringifySearchParams} from "../url/urlUtils";

interface PrismOptions {
  height?: number;
  width?: number;
  quality?: number;
  cmd?: "resize_then_fit" | "resize_then_crop";
}

/**
 * Generate a Prism url.
 * @param {PrismOptions} options Provide options to customize the generated url
 * @returns {function} A function that expects a base url and returns the full Prism url.
 */
// eslint-disable-next-line no-magic-numbers
function generatePrismUrl({height, width, quality = 100, cmd}: PrismOptions) {
  const params: {w?: string; h?: string; quality: string; cmd?: PrismOptions["cmd"]} = {
    quality: `${quality}`
  };

  if (width) {
    params.w = `${width}`;
  }

  if (height) {
    params.h = `${height}`;
  }

  if (cmd) {
    params.cmd = cmd;
  }

  const searchString = stringifySearchParams(params as {[x: string]: string});

  return (url: string) => `${url}?${searchString}`;
}

export {generatePrismUrl};
