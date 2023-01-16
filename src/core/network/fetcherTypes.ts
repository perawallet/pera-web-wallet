type FetcherMiddleware<Argument = any, ResolveWith = any> = (
  dataFromLastMiddleware: Argument
) => Promise<ResolveWith>;

interface FetcherConfig {
  baseUrl: string;
  initOptions?: RequestInit;
  responseMiddlewares?: FetcherMiddleware[];
  rejectMiddlewares?: FetcherMiddleware[];
  bodyParser?: (body: any) => any;
}

type FetcherErrorStatus = number | "ConnectionError" | "Cancelled" | "ApiError";

export type {FetcherMiddleware, FetcherConfig, FetcherErrorStatus};
