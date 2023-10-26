import {useAppContext} from "../../app/AppContext";
import useAsyncProcess from "../../network/async-process/useAsyncProcess";
import {peraApi} from "../pera/api/peraApi";
import {CurrencyInformation} from "../pera/api/peraApiModels";
import {MINUTE_IN_MS} from "../time/timeConstants";
import useInterval from "./useInterval";

// eslint-disable-next-line no-magic-numbers
const CURRENCY_POLLING_INTERVAL = 5 * MINUTE_IN_MS;

function useAlgoPricePolling() {
  const {dispatch} = useAppContext();
  const {runAsyncProcess} = useAsyncProcess<CurrencyInformation>({
    shouldResetDataWhenPending: false
  });

  useInterval(
    async () => {
      const currencyData = await runAsyncProcess(peraApi.getCurrency({currency: "USD"}));

      dispatch({
        type: "SET_ALGO_PRICE_AND_CHANGE",
        price: Number(currencyData.exchange_price),
        priceChangePercentage: currencyData.last_24_hours_price_change_percentage
      });
    },
    CURRENCY_POLLING_INTERVAL,
    {shouldRunCallbackAtStart: true}
  );
}

export default useAlgoPricePolling;
