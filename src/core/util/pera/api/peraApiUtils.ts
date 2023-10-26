import {getHiddenBanners} from "../../../../component/banner/util/bannerUtils";
import {FetcherMiddleware} from "../../../network/fetcherTypes";
import {
  AccountASA,
  BannerResponse
} from "./peraApiModels";

function mapAddressAccountASADataMiddleware(
  address: string
): FetcherMiddleware<ListRequestResponse<AccountASA>> {
  return (response) =>
    Promise.resolve({
      ...response,
      results: response.results.map((result) => ({...result, address}))
    });
}

function filterBannerMiddleware(bannerData: BannerResponse) {
  const hiddenBanners = getHiddenBanners();
  const filteredBanners = bannerData.results.filter(
    (banner) => !hiddenBanners.includes(String(banner.id))
  );

  return Promise.resolve({results: filteredBanners});
}

export {
  mapAddressAccountASADataMiddleware,
  filterBannerMiddleware
};
