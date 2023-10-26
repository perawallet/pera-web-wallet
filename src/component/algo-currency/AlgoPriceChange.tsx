import "./_algo-price-change.scss";

import {formatNumber} from "../../core/util/number/numberUtils";
import SimpleLoader from "../loader/simple/SimpleLoader";
import {useAppContext} from "../../core/app/AppContext";

// eslint-disable-next-line no-magic-numbers
const numberFormatterChangeAmount = formatNumber({
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
  signDisplay: "exceptZero"
});
const numberFormatter = formatNumber({
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

function AlgoPriceChange() {
  const {
    state: {algoPrice, priceChangePercentage}
  } = useAppContext();

  if (!priceChangePercentage) return null;

  const changeAmount =
    algoPrice && priceChangePercentage ? algoPrice * priceChangePercentage : 0;

  return (
    <div className={"algo-price-change-percentage"}>
      {priceChangePercentage ? (
        <span className={"typography--tagline algo-price-change-percentage__text"}>
          {`${numberFormatterChangeAmount(changeAmount)} ${numberFormatter(
            Number(priceChangePercentage)
          )}% 1D`}
        </span>
      ) : (
        <SimpleLoader customClassName={"algo-currency__loader"} />
      )}
    </div>
  );
}

export default AlgoPriceChange;
