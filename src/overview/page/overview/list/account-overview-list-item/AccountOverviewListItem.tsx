import "./_account-overview-list-item.scss";

import {memo} from "react";
import {ListItem} from "@hipo/react-ui-toolkit";

import {
  getAccountIcon,
  trimAccountAddress
} from "../../../../../account/util/accountUtils";
import ClipboardButton from "../../../../../component/clipboard/button/ClipboardButton";
import AccountOptionsDropdown from "../account-options-dropdown/AccountOptionsDropdown";
import {ALGO_UNIT} from "../../../../../core/ui/typography/typographyConstants";
import {useAppContext} from "../../../../../core/app/AppContext";
import {defaultPriceFormatter} from "../../../../../core/util/number/numberUtils";
import FormatUSDBalance from "../../../../../component/format-balance/usd/FormatUSDBalance";
import {getPeraExplorerLink} from "../../../../../core/util/pera/explorer/getPeraExplorerLink";
import Tooltip from "../../../../../component/tooltip/Tooltip";

export type AccountOverviewListItemProps = {
  accountUSDValue: AccountOverview["total_usd_value"];
  accountALGOValue: AccountOverview["total_algo_value"];
  address: AccountOverview["address"];
  assetCount: AccountOverview["standard_asset_count"];
  collectibleCount: AccountOverview["collectible_count"];
};

function AccountOverviewListItem({
  accountUSDValue,
  accountALGOValue,
  address,
  assetCount,
  collectibleCount
}: AccountOverviewListItemProps) {
  const {
    state: {accounts, preferredNetwork}
  } = useAppContext();
  const {algoFormatter} = defaultPriceFormatter();
  const peraExplorerLink = getPeraExplorerLink({
    id: address,
    type: "account-detail",
    network: preferredNetwork
  });
  // Accounts always have at least 1 asset(ALGO) as a product decision
  const accountAssetCount = assetCount && assetCount > 0 ? assetCount : 1;

  return (
    <ListItem customClassName={"account-overview-list-item"}>
      <a
        href={peraExplorerLink}
        target={"_blank"}
        rel={"noopener noreferrer"}
        className={"account-overview-list-item__link"}>
        {getAccountIcon({type: accounts[address].type, width: 32, height: 32})}

        <div className={"account-overview-list-item__grid-cell"}>
          {accounts[address]?.name && (
            <span className={"typography--medium-body text-color--main text--truncated"}>
              {accounts[address].name}
            </span>
          )}

          <p className={"typography--secondary-body text-color--gray-light"}>
            {trimAccountAddress(address)}
          </p>
        </div>

        <div className={"account-overview-list-item__grid-cell"}>
          <span className={"typography--medium-body text-color--main"}>
            {accountAssetCount}
          </span>

          <span className={"typography--secondary-body text-color--gray-light"}>
            {"Assets"}
          </span>
        </div>

        <div className={"account-overview-list-item__grid-cell"}>
          <span className={"typography--medium-body text-color--main"}>
            {collectibleCount}
          </span>

          <span className={"typography--secondary-body text-color--gray-light"}>
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
            customClassName={"typography--secondary-body text-color--gray-light"}
          />
        </div>
      </a>

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
    </ListItem>
  );
}

export default memo(AccountOverviewListItem);
