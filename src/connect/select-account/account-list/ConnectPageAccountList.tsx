import {ReactComponent as CheckboxIcon} from "../../../core/ui/icons/checkbox.svg";

import "./_connect-page-account-list.scss";

import {List, ListItem} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import {
  getAccountIcon,
  trimAccountAddress,
  trimAccountName
} from "../../../account/util/accountUtils";
import {useConnectFlowContext} from "../../context/ConnectFlowContext";
import {useAppContext} from "../../../core/app/AppContext";
import {filterOutItemsByKey} from "../../../core/util/array/arrayUtils";
import {usePortfolioContext} from "../../../overview/context/PortfolioOverviewContext";
import {ALGO_UNIT} from "../../../core/ui/typography/typographyConstants";
import {defaultPriceFormatter} from "../../../core/util/number/numberUtils";

function ConnectPageAccountList() {
  const {
    state: {accounts}
  } = useAppContext();
  const accountsArray = Object.values(accounts);
  const {
    formitoState: {selectedAccounts},
    dispatchFormitoAction
  } = useConnectFlowContext();
  const listClassName = classNames("connect-page-account-list", {
    "connect-page-account-list--is-selectable": !!onSelectAccount
  });
  const portfolioOverview = usePortfolioContext();
  const {algoFormatter} = defaultPriceFormatter();

  return (
    <List items={accountsArray} customClassName={listClassName}>
      {(account) => (
        <ListItem
          clickableListItemProps={{
            onClick: handleSelectAccount(account)
          }}
          customClassName={classNames("connect-page-account-list__item", {
            "connect-page-account-list__item--is-selected": selectedAccounts?.find(
              (selectedAccount) => selectedAccount.address === account.address
            )
          })}>
          <div className={"connect-page-account-list__item__icon"}>
            {getAccountIcon({type: account.type, width: 32, height: 32})}
          </div>

          <div
            className={
              "has-space-between align-center--vertically connect-page-account-list__item__body"
            }>
            <div>
              {account.name && (
                <div className={"connect-page-account-list__item__name"}>
                  {trimAccountName(account.name)}
                </div>
              )}

              <div
                className={classNames("connect-page-account-list__item__address", {
                  "text-color--gray-light typography--secondary-body": account.name
                })}>
                {trimAccountAddress(account.address)}
              </div>
            </div>

            <div className={"connect-page-account-list__item__algo-amount-wrapper"}>
              <span className={"typography--tiny text-color--gray-light"}>
                {`${ALGO_UNIT}${algoFormatter(
                  Number(
                    portfolioOverview?.accounts.find(
                      (portfolioAccount) => portfolioAccount.address === account.address
                    )?.total_algo_value || 0
                  ),
                  {
                    maximumFractionDigits: 2
                  }
                )}`}
              </span>

              <div
                className={
                  "align-center--horizontally connect-page-account-list__item__check-icon-wrapper"
                }>
                <CheckboxIcon />
              </div>
            </div>
          </div>
        </ListItem>
      )}
    </List>
  );

  function onSelectAccount(item: AppDBAccount) {
    const foundAlreadySelectedAccount = selectedAccounts?.find(
      (account) => account.address === item.address
    );
    let newSelectedAccounts: AppDBAccount[] = [];

    if (foundAlreadySelectedAccount) {
      newSelectedAccounts = filterOutItemsByKey(
        {
          items: [foundAlreadySelectedAccount],
          key: "address"
        },
        selectedAccounts || []
      );
    } else {
      newSelectedAccounts = [...(selectedAccounts || []), item];
    }
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        selectedAccounts: newSelectedAccounts
      }
    });
  }

  function handleSelectAccount(account: AppDBAccount) {
    return () => onSelectAccount!(account);
  }
}

export default ConnectPageAccountList;
