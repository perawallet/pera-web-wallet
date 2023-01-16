interface AsyncProcessState<Data = any, Payload = any> {
  isRequestPending: boolean;
  isRequestFetched: boolean;
  data: Data | null;
  error: Error | null;
  requestPayload?: Payload;
}

interface UseAsyncProcessOptions<Data = any> {
  initialState?: AsyncProcessState<Data>;
  shouldResetDataWhenPending?: boolean;
}

type AsyncProcessCallBack<Data> = <Response extends Data>(
  promise: Promise<Response>,
  options?: {
    forceResetPreviousAsyncState?: boolean;
    responseSerializer?: (response: Response) => Data;
  }
) => Promise<Response>;

type AsyncStateSetter<Data> = React.Dispatch<
  React.SetStateAction<AsyncProcessState<Data, any>>
>;
