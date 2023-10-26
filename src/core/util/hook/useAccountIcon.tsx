import {ReactComponent as AccountLedgerIcon} from "../../../core/ui/icons/account-ledger.svg";
import {ReactComponent as AccountStandardIcon} from "../../../core/ui/icons/account-standard.svg";
import {ReactComponent as AccountWatchIcon} from "../../../core/ui/icons/account-watch.svg";
import {ReactComponent as AccountRekeyedOrphanIcon} from "../../../core/ui/icons/account-rekeyed-orphan.svg";
import {ReactComponent as AccountRekeyedStandardIcon} from "../../../core/ui/icons/account-rekeyed-standard.svg";
import {ReactComponent as AccountRekeyedLedgerIcon} from "../../../core/ui/icons/account-rekeyed-ledger.svg";

import {useCallback} from "react";

type RenderAccountIconParams = Either<
  {account: Partial<AccountOverview>},
  {accountType: AccountIconTypes}
> & {size?: number};

import {usePortfolioContext} from "../../../overview/context/PortfolioOverviewContext";
import {getAccountType} from "../../../account/util/accountUtils";
import Skeleton from "../../../component/skeleton/Skeleton";

const DEFAULT_ACCOUNT_ICON_SIZE = 32;

type RekeyableAccountTypes = Exclude<AccountType, "watch">;

type AccountIconTypes = Uppercase<
  AccountType | `REKEYED_${RekeyableAccountTypes | "ORPHAN"}`
>;

const AccountIcons: Record<AccountIconTypes, typeof AccountStandardIcon> = {
  STANDARD: AccountStandardIcon,
  LEDGER: AccountLedgerIcon,
  REKEYED_STANDARD: AccountRekeyedStandardIcon,
  REKEYED_LEDGER: AccountRekeyedLedgerIcon,
  REKEYED_ORPHAN: AccountRekeyedOrphanIcon,
  WATCH: AccountWatchIcon
};

function useAccountIcon() {
  const portfolioContext = usePortfolioContext();

  /**
   * Render icon for the given "accountType" or
   * check account type of given account overview
   * and returns proper icon for the account
   *
   *  const {renderAccountIcon}= useAccountIcon();
   *
   *  renderAccountIcon({accountType: "LEDGER"}) // size is 32px by default
   *  renderAccountIcon({account,size: 40})
   */
  const renderAccountIcon = useCallback(
    ({
      account,
      accountType,
      size = DEFAULT_ACCOUNT_ICON_SIZE
    }: RenderAccountIconParams) => {
      if (!accountType && (!portfolioContext || !account))
        return <Skeleton width={size} height={size} borderRadius={size} />;

      const {accounts} = portfolioContext || {};
      let Icon = AccountStandardIcon;

      if (accountType) Icon = AccountIcons[accountType];
      else {
        let accountIconType: AccountIconTypes = getAccountType(
          account.rekeyed_to ? accounts[account?.rekeyed_to] || {} : account
        ).toUpperCase() as Uppercase<AccountType>;

        if (
          account.rekeyed_to &&
          accounts[account.rekeyed_to] &&
          // auth account can also be watch account
          accountIconType !== "WATCH"
        ) {
          accountIconType = `REKEYED_${accountIconType}`;
        }

        if (account.rekeyed_to && !accounts[account.rekeyed_to]) {
          accountIconType = "REKEYED_ORPHAN";
        }

        Icon = AccountIcons[accountIconType];
      }

      return <Icon width={size} height={size} />;
    },
    [portfolioContext]
  );

  return {renderAccountIcon};
}

export default useAccountIcon;
