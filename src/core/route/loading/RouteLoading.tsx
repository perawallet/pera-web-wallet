import "./_route-loading.scss";

import {useEffect, useState} from "react";

const SECOND_IN_MS = 1000;

interface RouteLoadingProps {
  /**
   * Number of seconds to wait before showing the content. Used to avoid flickering spinners caused by very fast page loads.
   */
  delayInSeconds?: number;
}

const DEFAULT_DELAY_IN_SECONDS = 1.3;

function RouteLoading({delayInSeconds = DEFAULT_DELAY_IN_SECONDS}: RouteLoadingProps) {
  const [shouldShowContent, setShouldShowContent] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShouldShowContent(true);
    }, delayInSeconds * SECOND_IN_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [delayInSeconds]);

  return shouldShowContent ? (
    <div className={"route-loading"}>
      {
        // Spinner can be placed here
        "Loading ..."
      }
    </div>
  ) : null;
}

export default RouteLoading;
