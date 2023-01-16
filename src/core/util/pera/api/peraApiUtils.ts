import {FetcherMiddleware} from "../../../network/fetcherTypes";
import {AccountASA} from "./peraApiModels";

function mapAddressAccountASADataMiddleware(
  address: string
): FetcherMiddleware<ListRequestResponse<AccountASA>> {
  return (response) =>
    Promise.resolve({
      ...response,
      results: response.results.map((result) => ({...result, address}))
    });
}

export {mapAddressAccountASADataMiddleware};
