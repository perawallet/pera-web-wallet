import {useLayoutEffect} from "react";

function useOnUnmount(callback?: VoidFunction) {
  // eslint-disable-next-line arrow-body-style
  useLayoutEffect(() => {
    return () => {
      if (callback) {
        callback();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useOnUnmount;
