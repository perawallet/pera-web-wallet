import "./_asset-logo.scss";

import {memo} from "react";
import classNames from "classnames";

import Image from "../../../component/image/Image";
interface AssetLogoProps {
  src: string;
  assetName: string;
  size?: number;
  customClassName?: string;
}

// eslint-disable-next-line no-magic-numbers
function AssetLogo({src, assetName, size = 32, customClassName}: AssetLogoProps) {
  return (
    <Image
      customClassName={classNames("asset-logo", customClassName)}
      src={src}
      // eslint-disable-next-line no-magic-numbers
      alt={assetName.substring(0, 2).toUpperCase()}
      width={size}
      height={size}
    />
  );
}

export default memo(AssetLogo);
