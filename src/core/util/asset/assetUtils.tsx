import {ReactComponent as AsaVerifiedIcon} from "../../../core/ui/icons/asa-verified.svg";
import {ReactComponent as AsaTrustedIcon} from "../../../core/ui/icons/asa-trusted.svg";
import {ReactComponent as AsaSuspiciousIcon} from "../../../core/ui/icons/asa-suspicious.svg";

import {Asset as AlgoSDKAsset} from "algosdk/dist/types/src/client/v2/algod/models/types";

import {formatNumber} from "../number/numberUtils";
import {AccountASA} from "../pera/api/peraApiModels";
import algod from "../algod/algod";

export type NodeAsset = AlgoSDKAsset;

/**
 * Checks if asset is an NFT
 */
function isNFT(asset: Asset): boolean {
  return parseFloat(asset.total) === 1;
}

function isALGO(asset: Asset | AccountASA): boolean {
  return asset.name === "ALGO";
}

/**
 * Checks if asset type is Asset or not
 */
function isAssetType(asset: Asset | AccountASA): asset is Asset {
  return (asset as Asset).total !== undefined;
}

/**
 * Calculates max fraction digits that asset can have
 *
 * @param {{
 *   assetDecimals?: number;
 *   amountInBaseUnits: number;
 * }} {
 *   assetDecimals,
 *   amountInBaseUnits
 * }
 * @returns {number}
 */
function getAssetAmountFormatMaxFractionDigits({
  assetDecimals,
  amountInBaseUnits
}: {
  assetDecimals?: number;
  amountInBaseUnits: number;
}) {
  let maxFractionDigits = 2;

  if (amountInBaseUnits < 1 && assetDecimals) {
    maxFractionDigits = assetDecimals;
  }

  return maxFractionDigits;
}

/**
 * Format asset amount using its decimal point
 * returns `${formattedAmount} ${unitName}` if unitName is given
 * formatter can be passed otherwise formatter with 'compact' notation is used as default
 * @param {{
 *   amount: number;
 *   assetDecimals?: number;
 *   formatter?: ReturnType<typeof formatNumber>;
 *   unitName?: string;
 * }} {
 *   assetDecimals,
 *   amount,
 *   formatter,
 *   unitName
 * }
 * @returns {string}
 */
function formatAssetAmount({
  assetDecimals,
  amount,
  formatter,
  unitName
}: {
  amount: number;
  assetDecimals?: number;
  formatter?: ReturnType<typeof formatNumber>;
  unitName?: string;
}) {
  const numberFormatter =
    formatter ||
    formatNumber({
      notation: "compact",
      maximumFractionDigits: getAssetAmountFormatMaxFractionDigits({
        assetDecimals,
        amountInBaseUnits: amount
      }),
      minimumFractionDigits: 0
    });
  const formattedAmount = numberFormatter(amount);

  return unitName ? `${formattedAmount} ${unitName}` : formattedAmount;
}

function integerToFractionDecimal(amount: number, fractionDecimals?: number) {
  return (
    amount /
    // eslint-disable-next-line no-magic-numbers
    Math.pow(10, fractionDecimals || 0)
  );
}

function fractionDecimalToInteger(amount: number, fractionDecimals?: number) {
  // eslint-disable-next-line no-magic-numbers
  return Math.round(amount * Math.pow(10, fractionDecimals || 0));
}

// eslint-disable-next-line no-magic-numbers
function renderVerificationTierIcon(asset: Asset | AccountASA, size = 16) {
  let icon;

  switch (asset.verification_tier) {
    case "verified":
      icon = <AsaVerifiedIcon width={size} height={size} />;
      break;

    case "trusted":
      icon = <AsaTrustedIcon width={size} height={size} />;
      break;

    case "suspicious":
      icon = <AsaSuspiciousIcon width={size} height={size} />;
      break;

    default:
      icon = null;
      break;
  }

  return icon;
}

function formatASAAmount(
  asset: AccountASA,
  options?: {assetAmount: number; inBaseUnits: boolean}
) {
  let amount = integerToFractionDecimal(Number(asset.amount), asset.fraction_decimals);

  if (options?.assetAmount) {
    amount = options.inBaseUnits
      ? fractionDecimalToInteger(options.assetAmount)
      : options.assetAmount;
  }

  return formatAssetAmount({
    amount,
    formatter: formatNumber({
      // eslint-disable-next-line no-magic-numbers
      maximumFractionDigits: asset.fraction_decimals || 2,
      minimumFractionDigits: 2
    }),
    assetDecimals: asset.fraction_decimals,
    unitName: asset.unit_name
  });
}

function getTransactionAssetsInfoFromNode(transactionAssetIndexes: number[]) {
  return Promise.all(
    transactionAssetIndexes.map(
      (assetIndex) => algod.client.getAssetByID(assetIndex).do() as unknown as NodeAsset
    )
  );
}

function getAssetUSDValue({amount, asset}: {amount: number; asset: Asset}) {
  return formatNumber({
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  })(
    integerToFractionDecimal(amount, asset.fraction_decimals) * Number(asset?.usd_value)
  );
}

export {
  isNFT,
  isALGO,
  isAssetType,
  getAssetAmountFormatMaxFractionDigits,
  formatAssetAmount,
  renderVerificationTierIcon,
  integerToFractionDecimal,
  fractionDecimalToInteger,
  formatASAAmount,
  getTransactionAssetsInfoFromNode,
  getAssetUSDValue
};
