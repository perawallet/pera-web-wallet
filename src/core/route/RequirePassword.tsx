import {Navigate, useLocation} from "react-router-dom";

import ROUTES from "./routes";
import {useAppContext} from "../app/AppContext";

type LocationState = {
  isNavigated?: boolean;
};

function RequirePassword({children}: {children: JSX.Element}) {
  const location = useLocation();
  const {isNavigated} = (location.state as LocationState) || {};
  const {
    state: {hashedMasterkey, masterkey}
  } = useAppContext();

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

  return children;
}

export default RequirePassword;
