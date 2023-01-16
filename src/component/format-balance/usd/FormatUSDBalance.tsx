import {useAppContext} from "../../../core/app/AppContext";
import {defaultPriceFormatter} from "../../../core/util/number/numberUtils";

interface FormatUSDBalanceProps {
  value: string | number;
  prefix?: string;
  customClassName?: string;
}

function FormatUSDBalance({value, prefix, customClassName}: FormatUSDBalanceProps) {
  const {
    state: {preferredNetwork}
  } = useAppContext();
  const {usdFormatter} = defaultPriceFormatter();

  return <div className={customClassName}>{renderBalance()}</div>;

  function renderBalance() {
    let balance = "-";

    if (preferredNetwork === "mainnet") {
      const presign = prefix?.concat(" ") || "";

      balance = `${presign}${usdFormatter(Number(value))}`;
    }

    return balance;
  }
}

export default FormatUSDBalance;
