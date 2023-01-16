import {Navigate, NavigateProps, To} from "react-router-dom";

import useLocationWithState from "../../util/hook/useLocationWithState";
import ROUTES from "../routes";

type NavigateFlowProps = Omit<NavigateProps, "to"> & {
  children: JSX.Element;
  to?: To;
};

type LocationState = {
  isNavigated: boolean;
};

function NavigateFlow(props: NavigateFlowProps) {
  const {to, children, ...rest} = props;
  const {isNavigated} = useLocationWithState<LocationState>();

  if (!isNavigated) {
    return <Navigate {...rest} to={to || ROUTES.OVERVIEW.ROUTE} />;
  }

  return children;
}

export default NavigateFlow;
