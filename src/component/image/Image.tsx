import "./_image.scss";

import React, {useState} from "react";
import classNames from "classnames";

import SimpleLoader from "../loader/simple/SimpleLoader";

type ImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  customClassName?: string;
  customPlaceholder?: React.ReactNode;
};

function Image({customClassName, alt, customPlaceholder, ...imgProps}: ImageProps) {
  const [shouldDisplayPlaceholder, setPlaceholderVisibility] = useState(true);
  const [shouldDisplayError, setErrorVisibility] = useState(false);

  return (
    <div
      className={classNames("image", customClassName)}
      style={{width: imgProps.width, height: imgProps.height}}>
      {shouldDisplayPlaceholder && !shouldDisplayError && (
        <div className={"image__placeholder"}>
          <SimpleLoader />
        </div>
      )}

      {shouldDisplayError && (
        <div className={"image__placeholder"}>{customPlaceholder || alt}</div>
      )}

      {!shouldDisplayError && (
        <img
          alt={shouldDisplayPlaceholder ? "" : alt}
          onLoad={handleHidePlaceholder}
          onError={handleDisplayError}
          {...imgProps}
          className={"image__img"}
        />
      )}
    </div>
  );

  function handleHidePlaceholder() {
    setPlaceholderVisibility(false);
  }

  function handleDisplayError() {
    handleHidePlaceholder();
    setErrorVisibility(true);
  }
}

export default Image;
