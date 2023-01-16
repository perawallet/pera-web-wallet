import algosdk from "algosdk";

export type FormatNumberOptions = Omit<Intl.NumberFormatOptions, "style"> & {
  style?: Intl.NumberFormatPartTypes | "percent";
  locale?: string;
};

/**
 * A higher-order function that uses Intl.NumberFormat behind the scenes to format a number
 * @param {Object} providedOptions -
 * @param {string} providedOptions.locale - Passed as first argument to the Intl.NumberFormat. Defaults to one of [navigator.language, "en-GB"] or respects provided locale from the call-site
 * @returns {function} Function
 */
function formatNumber(providedOptions: FormatNumberOptions = {}) {
  const {locale, ...otherOptions} = providedOptions;
  let options = otherOptions;
  const isCurrencyFormatting = options.style === "currency";
  const isCompactNotation = options.notation === "compact";

  if (isCompactNotation) {
    options = {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
      ...otherOptions
    };
  } else if (isCurrencyFormatting) {
    options = {
      currency: "USD",
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
      // "narrowSymbol" prevents showing explicit currency symbols, such as "US$" or "CA$"
      currencyDisplay: "narrowSymbol",
      ...otherOptions
    };
  } else {
    options = {
      maximumFractionDigits: 5,
      minimumFractionDigits: 2,
      style: "decimal",
      ...otherOptions
    };
  }

  let numberFormatter: {
    format: (x: number | bigint) => string;
  };

  try {
    numberFormatter = new Intl.NumberFormat(locale || "en-US", options);
  } catch (error) {
    numberFormatter = {
      format(x: number | bigint) {
        return x.toLocaleString();
      }
    };

    if (isCurrencyFormatting) {
      // currencyDisplay: "narrowSymbol" option is not supported by some browsers, try by providing "symbol"
      try {
        options.currencyDisplay = "symbol";
        numberFormatter = new Intl.NumberFormat(locale || "en-US", options);
      } catch (currencyFormattingError) {
        console.error({currencyFormattingError});
      }
    }
  }

  return (value: number) => {
    let formattedValue = "";

    if (!Object.is(value, NaN)) {
      formattedValue = numberFormatter.format(value);
    }

    return formattedValue;
  };
}

/**
 *
 * @param {number} decimal - Decimal value
 * @returns Percent representation of the decimal value
 */
function decimalToPercent(decimal: number): number {
  // eslint-disable-next-line no-magic-numbers
  return decimal * 100;
}

function formatPrice(options?: FormatNumberOptions) {
  const {style = "currency", currency = "USD", ...otherOptions} = options || {};

  const formatter = formatNumber({
    style,
    currency,
    ...otherOptions
  });

  return (value: number) => {
    let formattedValue = formatter(value);

    if (formattedValue && currency === "USD") {
      // in case `narrowSymbol` option was failed, make sure "US$" sign appears as just "$"
      formattedValue = formattedValue.replace("US$", "$");
    }

    return formattedValue;
  };
}

function defaultPriceFormatter() {
  const [algoFormatter, usdFormatter] = [
    (
      microAlgos: number,
      // eslint-disable-next-line no-magic-numbers
      options: FormatNumberOptions = {maximumFractionDigits: 6}
    ) => {
      let balance = "";

      try {
        balance = formatNumber(options)(algosdk.microalgosToAlgos(microAlgos));
      } catch (error) {
        console.error(error);
      }

      return balance;
    },
    (dollarAmount: number, options?: FormatNumberOptions) =>
      formatNumber({...options, style: "currency"})(dollarAmount)
  ];

  return {algoFormatter, usdFormatter};
}

export {formatNumber, decimalToPercent, formatPrice, defaultPriceFormatter};
