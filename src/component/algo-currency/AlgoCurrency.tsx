import {ReactComponent as AlgoIcon} from "../../core/ui/icons/algo.svg";

import "./_algo-currency.scss";

import useAsyncProcess from "../../core/network/async-process/useAsyncProcess";
import useInterval from "../../core/util/hook/useInterval";
import {peraApi} from "../../core/util/pera/api/peraApi";
import {CurrencyInformation} from "../../core/util/pera/api/peraApiModels";
import {MINUTE_IN_MS} from "../../core/util/time/timeConstants";
import {formatNumber} from "../../core/util/number/numberUtils";
import SimpleLoader from "../loader/simple/SimpleLoader";
import {useAppContext} from "../../core/app/AppContext";

// eslint-disable-next-line no-magic-numbers
const CURRENCY_POLLING_INTERVAL = 5 * MINUTE_IN_MS;
const numberFormatter = formatNumber({maximumFractionDigits: 2});

interface AlgoCurrencyProps {
  currency?: string;
}

function AlgoCurrency({currency = "USD"}: AlgoCurrencyProps) {
  const {
    state: {masterkey}
  } = useAppContext();
  const {state, runAsyncProcess} = useAsyncProcess<CurrencyInformation>({
    shouldResetDataWhenPending: false
  });

  useInterval(
    () => {
      runAsyncProcess(peraApi.getCurrency({currency}));
    },
    CURRENCY_POLLING_INTERVAL,
    {
      shouldRunCallbackAtStart: !!masterkey
    }
  );

  if (!masterkey || state.error) return null;

  return (
    <div className={"algo-currency"}>
      {state.isRequestFetched && state.data ? (
        <>
          <div className={"algo-currency__icon-wrapper"}>
            <AlgoIcon />
          </div>

          <span
            className={"typography--button text-color--gray-light"}>{`≈ ${numberFormatter(
            parseFloat(state.data.exchange_price)
          )} ${state.data.currency_id}`}</span>
        </>
      ) : (
        <SimpleLoader customClassName={"algo-currency__loader"} />
      )}
    </div>
  );
}

export default AlgoCurrency;
