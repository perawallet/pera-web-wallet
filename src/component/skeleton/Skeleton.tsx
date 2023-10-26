import classNames from "classnames";
import "./_skeleton.scss";

interface SkeletonProps {
  borderRadius: number;
  height: number;
  width?: number;
  customClassName?: string;
}

function Skeleton({borderRadius, height, width, customClassName}: SkeletonProps) {
  const skeletonStyle = {
    borderRadius: `${borderRadius}px`,
    height: `${height}px`,
    width: width ? `${width}px` : `100%`
  };

  return (
    <div className={classNames("skeleton", customClassName)} style={skeletonStyle} />
  );
}

export default Skeleton;
