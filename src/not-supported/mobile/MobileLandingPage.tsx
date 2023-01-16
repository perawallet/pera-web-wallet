import "./_mobile-landing-page.scss";

import MobileNotSupportedImage from "../../core/ui/image/mobile-not-supported.svg";
import {ReactComponent as PeraLogoWithText} from "../../core/ui/icons/pera-logo-with-text.svg";

import Image from "../../component/image/Image";
import LinkButton from "../../component/button/LinkButton";

const PERA_MOBILE_APP_URL = "https://perawallet.app/download";

function MobileLandingPage() {
  return (
    <div>
      <Image
        customClassName={"mobile-landing-page__heading-image"}
        alt={"three purple coins hang in the air. one has a pera logo on it"}
        src={MobileNotSupportedImage}
      />

      <div className={"mobile-landing-page__content"}>
        <PeraLogoWithText />

        <p className={"typography--small-subhead mobile-landing-page__message"}>
          {
            "Pera Web is not supported on mobile. Download Pera Mobile or use a desktop browser."
          }
        </p>

        <LinkButton
          size={"large"}
          external={true}
          to={PERA_MOBILE_APP_URL}
          customClassName={"button--fluid"}>
          {"Install Pera Wallet"}
        </LinkButton>
      </div>
    </div>
  );
}

export default MobileLandingPage;
