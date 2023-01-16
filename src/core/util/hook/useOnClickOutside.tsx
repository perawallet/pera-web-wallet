import {useEffect, useRef} from "react";

function useOnClickOutside(element: HTMLElement | null, callback: () => void) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    function eventListener(event: MouseEvent | TouchEvent) {
      if (
        !element ||
        !(event.target instanceof HTMLElement) ||
        element.contains(event.target)
      ) {
        return;
      }

      callbackRef.current();
    }

    document.addEventListener("mousedown", eventListener);
    document.addEventListener("touchstart", eventListener);

    return () => {
      document.removeEventListener("mousedown", eventListener);
      document.removeEventListener("touchstart", eventListener);
    };
  }, [element]);
}

export default useOnClickOutside;
