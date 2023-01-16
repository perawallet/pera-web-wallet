import grayPeraLoaderAnimation from "../../../core/ui/animation/Pera_Loader_Gray.json";
import colorfulPeraLoaderAnimation from "../../../core/ui/animation/Pera_Loader_Colorful.json";
import "./_pera-loader.scss";

import Lottie from "lottie-react";
import classNames from "classnames";

interface PeraLoaderProps {
  mode: "gray" | "colorful";
  customClassName?: string;
}

function PeraLoader({mode, customClassName}: PeraLoaderProps) {
  const source = mode === "gray" ? grayPeraLoaderAnimation : colorfulPeraLoaderAnimation;
  const loader = (
    <Lottie
      animationData={source}
      className={classNames("pera-loader", `pera-loader--${mode}`, customClassName)}
    />
  );

  if (mode === "colorful") {
    return (
      <div
        className={classNames(
          `pera-loader-wrapper--${mode}`,
          `${customClassName}-wrapper`
        )}>
        {loader}
      </div>
    );
  }

  return loader;
}

export default PeraLoader;
