import {ReactComponent as PeraLogo} from "../../../core/ui/icons/pera-logo.svg";
import {ReactComponent as ArrowLeftIcon} from "../../../core/ui/icons/arrow-left.svg";

import "./_page-header.scss";

import {useState} from "react";
import {Link} from "react-router-dom";
import classNames from "classnames";

import AlgoCurrency from "../../algo-currency/AlgoCurrency";
import LockButton from "../../lock-button/LockButton";
import NetworkBadge from "../../network-badge/NetworkBadge";
import ROUTES from "../../../core/route/routes";
import useScroll from "../../../core/util/hook/useScroll";
import {getPageHeaderBackButtonText} from "./util/pageHeaderUtils";
import useShouldShowPageHeaderGoBackButton from "./util/useShouldShowPageHeaderGoBackButton";
import {useNavigationContext} from "../../../core/route/context/NavigationContext";
import {useAppContext} from "../../../core/app/AppContext";

interface PageHeaderProps {
  customClassName?: string;
}

function PageHeader({customClassName}: PageHeaderProps) {
  const {
    state: {hasAccounts}
  } = useAppContext();
  const [scrollPosition, setScrollPosition] = useState(0);
  const shouldShowGoBackButton = useShouldShowPageHeaderGoBackButton();
  const {navigationState} = useNavigationContext();

  useScroll(() => {
    setScrollPosition(Math.round(window.pageYOffset));
  });

  return (
    <header
      className={classNames("page-header", customClassName, {
        "page-header--has-scrolled": scrollPosition > 0
      })}>
      <div className={"align-center--horizontally"}>
        <Link
          to={hasAccounts ? ROUTES.OVERVIEW.ROUTE : ROUTES.BASE}
          className={"align-center--vertically"}>
          <PeraLogo />

          <NetworkBadge />
        </Link>

        {shouldShowGoBackButton && (
          <div className={"page-header__go-back-button-container"}>
            <Link
              to={navigationState.headerGoBackLink}
              className={
                "button button--ghost button--medium page-header__go-back-button"
              }>
              <ArrowLeftIcon />

              {getPageHeaderBackButtonText(navigationState.headerGoBackLink)}
            </Link>
          </div>
        )}
      </div>

      <div className={"page-header__indicator-group"}>
        <AlgoCurrency />

        <LockButton />
      </div>
    </header>
  );
}
export default PageHeader;
