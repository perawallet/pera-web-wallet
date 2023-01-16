import {AccountASA} from "../pera/api/peraApiModels";
import {generatePrismUrl} from "../prism/prismUtils";

function getAssetImgSrc(asset: Asset | AccountASA, width?: number, height?: number) {
  const imgSrc = asset.collectible?.primary_image || asset.logo;

  return imgSrc
    ? // eslint-disable-next-line no-magic-numbers
      generatePrismUrl({width: width || 96, height: height || 96, quality: 70})(imgSrc)
    : "";
}

function getAssetPlaceholderContent(asset: Asset): string {
  // eslint-disable-next-line no-magic-numbers
  return asset.name.substring(0, 2).toUpperCase();
}

export {getAssetImgSrc, getAssetPlaceholderContent};
