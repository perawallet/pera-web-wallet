import {useLocation} from "react-router-dom";

import {AVAILABLE_PAGE_HEADER_GO_BACK_ROUTES} from "./pageHeaderConstants";

function useShouldShowPageHeaderGoBackButton() {
  const location = useLocation();

  return AVAILABLE_PAGE_HEADER_GO_BACK_ROUTES.some(
    (route) => route === location.pathname
  );
}

export default useShouldShowPageHeaderGoBackButton;
