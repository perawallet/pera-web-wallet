import {ReactComponent as ExportIcon} from "../../../core/ui/icons/export.svg";

import classNames from "classnames";

import "./_explore-item-card.scss";

import Image from "../../../component/image/Image";

interface ExploreItemCardProps {
  item: ExploreItem;
  customClassName?: string;
}

function ExploreItemCard({item, customClassName}: ExploreItemCardProps) {
  const {name, description, cover, logo, cta_text, cta_url} = item;

  return (
    <div className={classNames("explore-item-card", customClassName)}>
      <Image
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        src={require(`../../util/assets/${cover}`).default}
        customClassName={"explore-item-card__cover"}
      />
      <Image
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        src={require(`../../util/assets/${logo}`).default}
        customClassName={"explore-item-card__logo"}
      />
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
