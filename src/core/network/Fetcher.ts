import {isRecord} from "../util/object/objectUtils";
import {stringifySearchParams} from "../util/url/urlUtils";
import FetcherError from "./FetcherError";
import {FetcherConfig, FetcherMiddleware} from "./fetcherTypes";
import {fetchJSONMiddleware} from "./fetcherUtils";

class Fetcher {
  readonly config: FetcherConfig;

  constructor(config: FetcherConfig) {
    this.config = {
      responseMiddlewares: [fetchJSONMiddleware],
      rejectMiddlewares: [],
      ...config,
      initOptions: {
        ...(config?.initOptions || {})
      }
    };
  }

  run<Response>(
    options: Omit<RequestInit, "method" | "body"> & {
      method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
      params?: Record<string, any>;
      responseMiddlewares?: FetcherMiddleware[];
      rejectMiddlewares?: FetcherMiddleware[];
      body?: any;
      bodyParser?: (body: any) => any;
    },
    path: string
  ): Promise<Response> {
    const {baseUrl, initOptions, bodyParser: bodyParserFromConfig} = this.config;
    const {
      params,
      responseMiddlewares,
      rejectMiddlewares,
      body,
      bodyParser: bodyParserFromOptions,
      ...otherOptions
    } = options;

    const bodyParser = bodyParserFromOptions || bodyParserFromConfig;

    const url =
      isRecord(params) && Object.keys(params).length
        ? `${baseUrl}${path}?${stringifySearchParams(params)}`
        : `${baseUrl}${path}`;

    const promise = fetch(url, {
      body: bodyParser ? bodyParser(body) : body,
      ...initOptions,
      ...otherOptions
    });

    return promise
      .catch((error) => {
        if (error.name === "AbortError") {
          return Promise.reject(
            new FetcherError({
              type: "Cancelled",
              data: error,
              message: "Request cancelled",
              statusCode: NaN
            })
          );
        }

        return Promise.reject(
          new FetcherError({
            type: "ConnectionError",
            data: error,
            message: "Network error. Try again later.",
            statusCode: NaN
          })
        );
      })
      .then((response) => {
        if (response.ok) {
          return Promise.resolve(response);
        }

        return Promise.reject(response);
      })
      .then(async (response) => {
        const middlewares = responseMiddlewares || this.config.responseMiddlewares;
        let final = response;

        if (middlewares) {
          for (const middleware of middlewares) {
            final = await middleware(final);
          }
        }

        return final as unknown as Promise<Response>;
      })
      .catch(async (errorResponse) => {
        if (errorResponse.status === "Cancelled") {
          return Promise.reject(errorResponse);
        }

        const middlewares = rejectMiddlewares || this.config.rejectMiddlewares;
        let finalError;

        try {
          const errorResponseJSON = await errorResponse.json();

          finalError = new FetcherError({
            statusCode: errorResponse.status,
            type: errorResponseJSON?.type || "ApiError",
            data: errorResponseJSON,
            message:
              // TODO: generateErrorMessage(errorResponseJSON) ||
              `${otherOptions.method} ${url} request failed`
          });
        } catch {
          finalError = new FetcherError({
            statusCode: errorResponse.status,
            type: "ApiError",
            data: errorResponse,
            message:
              // TODO: generateErrorMessage(errorResponse) ||
              `${otherOptions.method} ${url} request failed`
          });
        }

        if (middlewares) {
          for (const middleware of middlewares) {
            finalError = await middleware(finalError);
          }
        }

        return Promise.reject(finalError);
      });
  }
}

export default Fetcher;
