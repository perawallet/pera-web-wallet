import {ReactComponent as CloseIcon} from "../../core/ui/icons/close.svg";
import {ReactComponent as ArrowRightIcon} from "../../core/ui/icons/arrow-right.svg";
import {ReactComponent as GovernanceIllusturation} from "../../core/ui/image/governance-banner.svg";

import "./_banner.scss";
import "./_banner.dark.scss";

import classNames from "classnames";
import {useState} from "react";

import Button from "../button/Button";
import {BannerInformation} from "../../core/util/pera/api/peraApiModels";
import webStorage, {STORED_KEYS} from "../../core/util/storage/web/webStorage";
import {getHiddenBanners} from "./util/bannerUtils";

interface BannerProps {
  banner: BannerInformation;
}

function Banner({
  banner: {
    id,
    type,
    title,
    subtitle: description,
    button_label: buttonLabel,
    button_web_url: buttonWebUrl
  }
}: BannerProps) {
  const [isBannerOpen, setBannerVisibility] = useState(true);

  return (
    <div
      className={classNames(
        "banner-container",
        `banner--${type}`,
        isBannerOpen ? "banner--open" : "banner--closed"
      )}>
      <div className={"banner-inner"}>
        <div>
          <h3 className={"typography--h3 banner-detail__title"}>{title}</h3>

          <p className={"typography--body banner-detail__description"}>{description}</p>
        </div>

        {type === "governance" && (
          <GovernanceIllusturation className={"banner__governance-illusturation"} />
        )}

        <a
          href={buttonWebUrl}
          rel={"noopener noreferrer"}
          target={"_blank"}
          className={"button button--light typography--medium-body banner__link-cta"}>
          {buttonLabel}

          <ArrowRightIcon />
        </a>

        <Button
          buttonType={"ghost"}
          size={"small"}
          customClassName={"banner__close-cta"}
          onClick={handleCloseClick}>
          <CloseIcon />
        </Button>
      </div>
    </div>
  );

  function handleCloseClick() {
    const hiddenBanners = getHiddenBanners();

    if (!hiddenBanners.includes(String(id))) {
      hiddenBanners.push(String(id));
    }
    webStorage.local.setItem(STORED_KEYS.HIDDEN_BANNERS, hiddenBanners);

    setBannerVisibility(false);
  }
}

export default Banner;
