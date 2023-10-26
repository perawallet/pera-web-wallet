import "./_page-banner.scss";

import AlgoCurrency from "../../algo-currency/AlgoCurrency";
import AlgoPriceChange from "../../algo-currency/AlgoPriceChange";

function PageBanner() {
  return (
    <div className={"page-banner"}>
      <AlgoCurrency />
      <AlgoPriceChange />
    </div>
  );
}

export default PageBanner;
