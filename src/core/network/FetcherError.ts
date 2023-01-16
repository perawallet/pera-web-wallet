import {FetcherErrorStatus} from "./fetcherTypes";

class FetcherError extends Error {
  data: any;
  type: FetcherErrorStatus;
  statusCode: number;

  constructor(
    options: {
      type: FetcherErrorStatus;
      data: any;
      message: string;
      statusCode: number;
    },
    ...args: any[]
  ) {
    super(...args);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetcherError);
    }

    this.name = "FetcherError";
    this.type = options.type;
    this.data = options.data;
    this.message = options.message;
    this.statusCode = options.statusCode;
  }
}

export default FetcherError;
