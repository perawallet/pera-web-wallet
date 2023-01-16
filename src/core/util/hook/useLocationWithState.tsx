import {Location, useLocation} from "react-router";

type LocationWithState<T> = Location & {state?: T};

function useLocationWithState<LocationState>(): Partial<LocationState> {
  const location = useLocation() as LocationWithState<LocationState>;

  return location.state || {};
}

export default useLocationWithState;
