import "./_account-overview-list-item.scss";

import {ListItem} from "@hipo/react-ui-toolkit";

import {trimAccountAddress} from "../../../../../account/util/accountUtils";
import ClipboardButton from "../../../../../component/clipboard/button/ClipboardButton";
import AccountOptionsDropdown from "../account-options-dropdown/AccountOptionsDropdown";
import {ALGO_UNIT} from "../../../../../core/ui/typography/typographyConstants";
import {useAppContext} from "../../../../../core/app/AppContext";
import {defaultPriceFormatter} from "../../../../../core/util/number/numberUtils";
import FormatUSDBalance from "../../../../../component/format-balance/usd/FormatUSDBalance";
import {getPeraExplorerLink} from "../../../../../core/util/pera/explorer/getPeraExplorerLink";
import Tooltip from "../../../../../component/tooltip/Tooltip";
import {usePortfolioContext} from "../../../../context/PortfolioOverviewContext";
import useAccountIcon from "../../../../../core/util/hook/useAccountIcon";

function AccountOverviewListItem({account}: {account: AccountOverview}) {
  const {
    state: {preferredNetwork}
  } = useAppContext();
  const {algoFormatter} = defaultPriceFormatter();
  const {
    address,
    standard_asset_count: assetCount,
    collectible_count: collectibleCount,
    total_algo_value: accountALGOValue,
    total_usd_value: accountUSDValue,
    rekeyed_to,
    name: accountName,
    domainName
  } = account;
  const peraExplorerLink = getPeraExplorerLink({
    id: address,
    type: "account-detail",
    network: preferredNetwork
  });
  const portfolioOverview = usePortfolioContext();
  const rekeyedToAccount = portfolioOverview!.accounts[rekeyed_to || ""] || {};
  const {renderAccountIcon} = useAccountIcon();

  if (!portfolioOverview) return null;

  return (
    <ListItem customClassName={"account-overview-list-item"}>
      <a
        href={peraExplorerLink}
        target={"_blank"}
        rel={"noopener noreferrer"}
        className={"account-overview-list-item__link"}>
        {renderAccountIcon({account})}

        <div className={"account-overview-list-item__grid-wrapper"}>
          <div className={"account-overview-list-item__grid-cell"}>
            <span className={"typography--medium-body text-color--main text--truncated"}>
              {accountName || trimAccountAddress(address)}
            </span>

            <p className={"typography--secondary-body text-color--gray-lighter"}>
              {rekeyed_to &&
                `Rekeyed to ${
                  rekeyedToAccount.domainName?.name ||
                  rekeyedToAccount.name ||
                  trimAccountAddress(rekeyed_to)
                }`}

              {rekeyed_to ? null : domainName?.name || trimAccountAddress(address)}
            </p>
          </div>

          <div className={"account-overview-list-item__grid-cell"}>
            <span className={"typography--medium-body text-color--main"}>
              {assetCount === 0 ? 1 : assetCount}
            </span>

            <span className={"typography--secondary-body text-color--gray-lighter"}>
              {"Assets"}
            </span>
          </div>

          <div className={"account-overview-list-item__grid-cell"}>
            <span className={"typography--medium-body text-color--main"}>
              {collectibleCount}
            </span>

            <span className={"typography--secondary-body text-color--gray-lighter"}>
              {"NFTs"}
            </span>
          </div>

          <div className={"account-overview-list-item__grid-cell"}>
            <span className={"typography--bold-body text-color--main"}>
              {`${ALGO_UNIT}${algoFormatter(Number(accountALGOValue), {
                maximumFractionDigits: 2
              })}`}
            </span>

            <FormatUSDBalance
              value={accountUSDValue}
              customClassName={"typography--secondary-body text-color--gray-lighter"}
            />
          </div>
        </div>
      </a>

      <div className={"account-overview-list-item__actions"}>
        <Tooltip
          content={"Copy Address"}
          dataFor={"account-overview-list-item__copy-clipboard"}>
          <ClipboardButton
            buttonType={"light"}
            size={"small"}
            iconPosition={"right"}
            textToCopy={address}
            copiedMessage={"Account address copied!"}
            customClassName={"account-overview-list-item__clipboard-button"}
            aria-label={"Copy account address to clipboard"}
          />
        </Tooltip>

        <AccountOptionsDropdown address={address} />
      </div>
    </ListItem>
  );
}

export default AccountOverviewListItem;
