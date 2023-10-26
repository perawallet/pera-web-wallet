import {ReactComponent as AlgoIcon} from "../../core/ui/icons/algo.svg";

import "./_algo-currency.scss";

import {formatNumber} from "../../core/util/number/numberUtils";
import SimpleLoader from "../loader/simple/SimpleLoader";
import {useAppContext} from "../../core/app/AppContext";

// eslint-disable-next-line no-magic-numbers
const numberFormatter = formatNumber({maximumFractionDigits: 4});

function AlgoCurrency() {
  const {
    state: {algoPrice}
  } = useAppContext();

  if (!algoPrice) return null;

  return (
    <div className={"algo-currency"}>
      {algoPrice ? (
        <>
          <p className={"typography--secondary-body"}>{"ALGO"}</p>

          <div className={"algo-currency__icon-wrapper"}>
            <AlgoIcon />
          </div>

          <span className={"typography--medium-body"}>{`$${numberFormatter(
            algoPrice
          )}`}</span>
        </>
      ) : (
        <SimpleLoader customClassName={"algo-currency__loader"} />
      )}
    </div>
  );
}

export default AlgoCurrency;
