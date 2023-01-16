import {useCallback, useEffect, useRef} from "react";

import {useAppContext} from "../../app/AppContext";
import {MINUTE_IN_MS} from "../time/timeConstants";
import useEventListener from "./useEventListener";
import useLockApp from "./useLockApp";

// eslint-disable-next-line no-magic-numbers
const IDLE_TIMEOUT = 5 * MINUTE_IN_MS;
const MOUSE_MOVE_DEBOUNCE = 100;

function useCheckForInactivity() {
  const documentRef = useRef<Document>(document);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const mouseMoveRef = useRef<NodeJS.Timeout>();
  const {
    state: {masterkey}
  } = useAppContext();
  const lockApp = useLockApp();

  const resetIdleTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // set the timer
    timeoutRef.current = setTimeout(lockApp, IDLE_TIMEOUT);
  }, [lockApp]);

  useEffect(() => {
    // do not start idle check if user did not enter passcode
    if (!masterkey) return;

    resetIdleTimer();
  }, [masterkey, resetIdleTimer]);

  useEventListener("mousemove", debouncedOnMouseMove, documentRef);

  function debouncedOnMouseMove() {
    // do not start mouse move listener if user did not enter passcode
    if (!masterkey) return;

    if (mouseMoveRef.current) clearTimeout(mouseMoveRef.current);

    mouseMoveRef.current = setTimeout(resetIdleTimer, MOUSE_MOVE_DEBOUNCE);
  }
}

export default useCheckForInactivity;
