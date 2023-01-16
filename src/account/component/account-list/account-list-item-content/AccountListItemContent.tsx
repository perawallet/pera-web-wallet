import "./_account-list-item-content.scss";

import classNames from "classnames";

import {getAccountIcon, trimAccountAddress} from "../../../util/accountUtils";
import {ALGO_UNIT} from "../../../../core/ui/typography/typographyConstants";
import {defaultPriceFormatter} from "../../../../core/util/number/numberUtils";

export type AccountListItemContentProps = {
  address: string;
  accountType?: AccountType;
  name?: string;
  balance?: string;
};

function AccountListItemContent({
  accountType,
  name,
  address,
  balance
}: AccountListItemContentProps) {
  const {algoFormatter} = defaultPriceFormatter();
  const accountAddressClassname = classNames({
    "typography--secondary-body text-color--gray-light": name,
    "typography--body": !name
  });

  return (
    <div className={"account-list-item-content"}>
      {getAccountIcon({type: accountType, width: 32, height: 32})}

      <div className={"account-list-item-content__account-info"}>
        {name && (
          <span className={"account-list-item-content__account-name text--truncated"}>
            {name}
          </span>
        )}

        <span className={accountAddressClassname}>{trimAccountAddress(address)}</span>
      </div>

      {balance && (
        <div
          className={
            "account-balance typography--bold-body"
          }>{`${ALGO_UNIT}${algoFormatter(Number(balance), {
          maximumFractionDigits: 2
        })}
          `}</div>
      )}
    </div>
  );
}

export default AccountListItemContent;
