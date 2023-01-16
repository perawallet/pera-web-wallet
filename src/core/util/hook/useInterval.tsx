import {useEffect, useRef, useState} from "react";

export interface IntervalHookOptions {
  shouldStartInterval?: boolean;
  // Normally, callback will be called at the end of first interval for the first time,
  // this option overrides it to run as soon as the interval starts
  shouldRunCallbackAtStart?: boolean;
  refreshLimit?: number;
}

function useInterval(
  callback: VoidFunction,
  delay: number,
  options?: IntervalHookOptions
) {
  const timerRef = useRef<NodeJS.Timeout | undefined>();
  const {
    shouldStartInterval = true,
    shouldRunCallbackAtStart = false,
    refreshLimit
  } = options || {};
  const refreshCountRef = useRef<number>(0);
  const savedCallback = useRef<VoidFunction>();
  const [isIntervalRunning, setStartInterval] = useState<boolean>(shouldStartInterval);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (isIntervalRunning && shouldRunCallbackAtStart && savedCallback.current) {
      savedCallback.current();
    }
  }, [shouldRunCallbackAtStart, isIntervalRunning]);

  useEffect(() => {
    if (isIntervalRunning) {
      timerRef.current = setInterval(tick, delay);
    }

    return () => {
      if (timerRef.current) {
        clearTimer();
      }
    };

    function tick() {
      if (refreshLimit && refreshCountRef?.current >= refreshLimit) {
        setStartInterval(false);
        clearTimer();
      }

      savedCallback.current!();
      refreshCountRef.current += 1;
    }
  }, [delay, refreshLimit, isIntervalRunning]);

  function clearTimer() {
    refreshCountRef.current = 0;
    clearInterval(timerRef.current);
  }
}

/* USAGE:

  useInterval(
    () => setShouldGetDocumentPackage(true),
    GET_DOCUMENT_PACKAGE_REQUEST_POLLING_INTERVAL,
    {
      shouldStartInterval: isCreateDocumentPackageRequested,
      shouldRunCallbackAtStart: true,
      refreshLimit:10
    }
  );

*/

export default useInterval;
