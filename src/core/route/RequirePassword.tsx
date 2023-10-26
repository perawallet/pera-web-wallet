import {Navigate, useLocation} from "react-router-dom";

import ROUTES from "./routes";
import {useAppContext} from "../app/AppContext";
import {usePortfolioContext} from "../../overview/context/PortfolioOverviewContext";
import PeraLoader from "../../component/loader/pera/PeraLoader";

type LocationState = {
  isNavigated?: boolean;
};

function RequirePassword({children}: {children: JSX.Element}) {
  const location = useLocation();
  const {isNavigated} = (location.state as LocationState) || {};
  const {
    state: {hasAccounts, hashedMasterkey, masterkey}
  } = useAppContext();
  const portfolioOverview = usePortfolioContext();

  if (!hashedMasterkey) {
    return <Navigate to={ROUTES.PASSWORD.CREATE.FULL_PATH} state={{from: location}} />;
  }

  if (!masterkey) {
    return (
      <Navigate
        to={ROUTES.PASSWORD.ROUTE}
        state={{from: location, isNavigated, ctaText: "Proceed"}}
        replace={true}
      />
    );
  }

  if (
    masterkey &&
    hasAccounts &&
    !portfolioOverview &&
    location.pathname !== ROUTES.SETTINGS.ROUTE
  )
    return <PeraLoader mode={"gray"} customClassName={"pera-loader--align-center"} />;

  return children;
}

export default RequirePassword;
