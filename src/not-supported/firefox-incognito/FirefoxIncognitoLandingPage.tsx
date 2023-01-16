import "./_firefox-incognito-landing-page.scss";

import {ReactComponent as PeraLogo} from "../../core/ui/icons/pera-logo.svg";
import firefoxIncognitoLandingPageImgSrc from "../../core/ui/image/firefox-not-supported.png";

function FirefoxIncognitoLandingPage() {
  return (
    <div className={"firefox-incognito-landing-page"}>
      <PeraLogo />

      <figure className={"firefox-incognito-landing-page__figure"}>
        <img
          className={"firefox-incognito-landing-page__figure-img"}
          src={firefoxIncognitoLandingPageImgSrc}
          alt={"Globe wireframe with its shade."}
        />

        <figcaption className={"firefox-incognito-landing-page__header typography--h2"}>
          {"Pera Web Wallet is not supported on Firefox Private Browsing"}
        </figcaption>

        <figcaption className={"typography--small-subhead"}>
          {"Please use a different browser or switch to regular browsing mode."}
        </figcaption>
      </figure>
    </div>
  );
}

export default FirefoxIncognitoLandingPage;
