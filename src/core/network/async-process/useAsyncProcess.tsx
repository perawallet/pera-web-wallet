import {useCallback, useEffect, useRef, useState} from "react";

import useOnUnmount from "../../util/hook/useOnUnmount";
import {INITIAL_ASYNC_PROCESS_STATE} from "./asyncProcessConstants";

function useAsyncProcess<Data>(options?: UseAsyncProcessOptions<Data>) {
  const {initialState, shouldResetDataWhenPending = true} = options || {};
  const [asyncState, setAsyncState] = useState<AsyncProcessState<Data>>(
    initialState || INITIAL_ASYNC_PROCESS_STATE
  );
  const latestDataRef = useRef(asyncState.data);
  const isUnmountedRef = useRef(false);
  const asyncStateSetter = useCallback<AsyncStateSetter<Data>>(
    (state) => (isUnmountedRef.current ? () => undefined : setAsyncState(state)),
    []
  );

  const runAsyncProcess: AsyncProcessCallBack<Data> = useCallback(
    (promise, asyncCallbackOptions) => {
      const shouldReset =
        typeof asyncCallbackOptions?.forceResetPreviousAsyncState === "boolean"
          ? asyncCallbackOptions.forceResetPreviousAsyncState
          : shouldResetDataWhenPending;

      asyncStateSetter({
        isRequestPending: true,
        isRequestFetched: !shouldReset,
        data: shouldReset ? null : latestDataRef.current,
        error: null
      });

      promise
        .then((response) => {
          asyncStateSetter({
            isRequestPending: false,
            isRequestFetched: true,
            data: asyncCallbackOptions?.responseSerializer
              ? asyncCallbackOptions.responseSerializer(response)
              : response,
            error: null
          });
        })
        .catch((error) => {
          console.error(error);
          asyncStateSetter({
            isRequestPending: false,
            isRequestFetched: true,
            data: null,
            error
          });
        });

      return promise;
    },
    [asyncStateSetter, shouldResetDataWhenPending]
  );

  useEffect(() => {
    latestDataRef.current = asyncState.data;
  }, [asyncState.data]);

  useOnUnmount(() => {
    isUnmountedRef.current = true;
  });

  return {
    state: asyncState,
    setState: asyncStateSetter,
    runAsyncProcess
  };
}

export default useAsyncProcess;
