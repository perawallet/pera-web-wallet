import {useRef, useLayoutEffect, useEffect, RefObject} from "react";

export interface ScrollHookOptions {
  ref?: RefObject<HTMLElement>;
  delay?: null | number;
}

const DEFAULT_DELAY = 200;

function useScroll(effect: VoidFunction, options?: ScrollHookOptions) {
  const {delay = DEFAULT_DELAY, ref} = options || {};
  const effectRef = useRef(effect);

  useLayoutEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    let element: HTMLElement | Window = window;
    let timeoutId: any;

    if (ref?.current) {
      element = ref.current;
    }

    element?.addEventListener("scroll", handleScroll);

    return () => {
      element?.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };

    function handleScroll() {
      if (typeof delay === "number") {
        if (!timeoutId) {
          timeoutId = setTimeout(runCallback, delay);
        }
      } else {
        runCallback();
      }
    }

    function runCallback() {
      effectRef.current();
      timeoutId = undefined;
    }
  }, [delay, ref]);
}

export default useScroll;

/* USAGE:
  const [scrollPosition, setScrollPosition] = useState({x:0, y: 0});
  const containerRef = useRef<HTMLDivElement>(null);

  useScroll({ref: containerRef}, () => {
    setScrollPosition({
      x: Math.round(containerRef.current?.scrollTop),
      y: Math.round(containerRef.current?.scrollLeft)
    });
  });

  return (
    <div ref={containerRef}>
      ...
    </div>
  )
*/
