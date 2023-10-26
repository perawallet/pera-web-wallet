import "./_account-list-item-content.scss";

import {ReactComponent as ExportIcon} from "../../../../core/ui/icons/export.svg";
import {ReactComponent as WarningIcon} from "../../../../core/ui/icons/warning.svg";

import {microalgosToAlgos} from "algosdk";

import {getAccountType, trimAccountAddress} from "../../../util/accountUtils";
import {ALGO_UNIT} from "../../../../core/ui/typography/typographyConstants";
import {defaultPriceFormatter} from "../../../../core/util/number/numberUtils";
import LinkButton from "../../../../component/button/LinkButton";
import {getPeraExplorerLink} from "../../../../core/util/pera/explorer/getPeraExplorerLink";
import {useAppContext} from "../../../../core/app/AppContext";
import useAccountIcon from "../../../../core/util/hook/useAccountIcon";
import Tooltip from "../../../../component/tooltip/Tooltip";

export type AccountListItemContentProps = {
  account: AccountOverview | (Partial<AccountOverview> & {address: string});
  customDescription?: string;
  shouldDisplayYouTag?: boolean;
  shouldDisplayExplorerLink?: boolean;
  shouldDisplayMinBalanceWarning?: boolean;
};
function AccountListItemContent({
  account,
  customDescription,
  shouldDisplayExplorerLink = false,
  shouldDisplayMinBalanceWarning = false,
  shouldDisplayYouTag = false
}: AccountListItemContentProps) {
  const {
    name: accountName,
    domainName,
    address,
    total_algo_value,
    minimum_balance
  } = account;
  const {renderAccountIcon} = useAccountIcon();
  const {algoFormatter} = defaultPriceFormatter();
  const {
    state: {preferredNetwork}
  } = useAppContext();

  const accountIcon = account.date
    ? renderAccountIcon({account})
    : renderAccountIcon({
        accountType: getAccountType(account) === "ledger" ? "LEDGER" : "STANDARD"
      });

  return (
    <div className={"account-list-item-content"}>
      {accountIcon}

      <div className={"account-list-item-content__account-info"}>
        <div className={"account-list-item-content__account-info__name"}>
          <span
            className={
              "account-list-item-content__account-name text-color--main text--truncated"
            }>
            {accountName || trimAccountAddress(address)}

            {shouldDisplayYouTag && (
              <span className={"text-color--gray-light"}>{" (You)"}</span>
            )}
          </span>

          {shouldDisplayMinBalanceWarning &&
            minimum_balance &&
            minimum_balance > Number(total_algo_value) && (
              <Tooltip
                content={`Minimum balance required (${microalgosToAlgos(
                  minimum_balance
                )} ALGO)`}
                dataFor={"account-list-item-content-min-balance-warning"}>
                <WarningIcon width={16} height={16} />
              </Tooltip>
            )}
        </div>

        <span className={"typography--secondary-body text-color--gray-lighter"}>
          {customDescription || domainName?.name || trimAccountAddress(address)}
        </span>
      </div>

      {total_algo_value && (
        <div className={"account-balance typography--bold-body text-color--main"}>
          {`${ALGO_UNIT}${algoFormatter(Number(total_algo_value), {
            maximumFractionDigits: 2
          })}
          `}

          {shouldDisplayExplorerLink && (
            <LinkButton
              buttonType={"ghost"}
              external={true}
              to={getPeraExplorerLink({
                id: address,
                type: "account-detail",
                network: preferredNetwork
              })}>
              <ExportIcon width={20} height={20} />
            </LinkButton>
          )}
        </div>
      )}
    </div>
  );
}

export default AccountListItemContent;
