import {ReactComponent as ExportIcon} from "../../../core/ui/icons/export.svg";

import {useEffect, useState} from "react";
import classNames from "classnames";

import "./_explore-item-card.scss";

import Image from "../../../component/image/Image";

interface ExploreItemCardProps {
  item: ExploreItem;
  customClassName?: string;
}

function ExploreItemCard({item, customClassName}: ExploreItemCardProps) {
  const {name, description, cover, logo, cta_text, cta_url} = item;
  const [dynamicImages, setDynamicImages] = useState<{cover: string; logo: string}>();

  useEffect(() => {
    (async () => {
      const [coverSrc, logoSrc] = await Promise.all([
        import(`../../util/assets/${cover}`),
        import(`../../util/assets/${logo}`)
      ]);

      setDynamicImages({cover: coverSrc.default, logo: logoSrc.default});
    })();
  }, [cover, logo]);

  return (
    <div className={classNames("explore-item-card", customClassName)}>
      <Image src={dynamicImages?.cover} customClassName={"explore-item-card__cover"} />

      <Image src={dynamicImages?.logo} customClassName={"explore-item-card__logo"} />

      <div className={"explore-item-card__name typography--caption text-color--gray"}>
        {name}
      </div>

      <div className={"explore-item-card__description typography--small-subhead"}>
        {description}
      </div>

      <a
        href={cta_url}
        className={"explore-item-card__cta button button--light"}
        target={"_blank"}
        rel={"noreferrer noopener"}>
        {cta_text} <ExportIcon className={"explore-item-card__cta__icon"} width={20} />
      </a>
    </div>
  );
}

export default ExploreItemCard;
