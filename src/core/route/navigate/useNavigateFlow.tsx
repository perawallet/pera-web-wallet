import {NavigateOptions, To, useNavigate} from "react-router-dom";

function useNavigateFlow() {
  const navigate = useNavigate();

  return (to: To, options?: NavigateOptions) =>
    navigate(to, {...options, state: {...options?.state, isNavigated: true}});
}

export default useNavigateFlow;
