import "./_account-import-onboarding-option-list.scss";

import {SyntheticEvent} from "react";
import {List, ListItem} from "@hipo/react-ui-toolkit";
import {useLocation} from "react-router-dom";
import classNames from "classnames";

import {
  AccountImportOptions,
  getAccountOnboardingOptions
} from "./util/accountOnboardingOptionListConstants";
import LinkButton from "../../../component/button/LinkButton";
import Button from "../../../component/button/Button";
import AccountImportOnboardingOptionListItemContent from "./AccountImportOnboardingOptionListItemContent";

interface AccountOnboardingOptionListProps {
  layout?: "horizontal" | "vertical";
  onOptionClick?: (id: AccountImportOptions["id"]) => void;
  customClassName?: string;
}

function AccountImportOnboardingOptionList({
  layout = "horizontal",
  onOptionClick,
  customClassName
}: AccountOnboardingOptionListProps) {
  const location = useLocation();
  const accountOnboardingOptionListClassnames = classNames(
    "account-import-onboarding-option-list",
    {
      "account-import-onboarding-option-list--vertical": layout === "vertical"
    },

    customClassName
  );
  const accountOptions = getAccountOnboardingOptions(
    layout === "horizontal" ? "quick-access" : "default"
  );

  return (
    <List items={accountOptions} customClassName={accountOnboardingOptionListClassnames}>
      {({id, icon, title, description, to, shouldShowNew, shouldShowComingSoon}) => (
        <ListItem
          customClassName={classNames(
            "account-import-onboarding-option-list__item-container",
            {
              "account-import-onboarding-option-list__item-container--coming-soon":
                shouldShowComingSoon
            }
          )}>
          {onOptionClick ? (
            <Button
              id={id}
              onClick={handleOptionClick}
              buttonType={"custom"}
              customClassName={"account-import-onboarding-option-list__item"}>
              <AccountImportOnboardingOptionListItemContent
                icon={icon}
                title={title}
                description={description}
                shouldShowNew={shouldShowNew}
                shouldShowComingSoon={shouldShowComingSoon}
              />
            </Button>
          ) : (
            <LinkButton
              id={id}
              to={to}
              buttonType={"custom"}
              state={{from: location}}
              customClassName={"account-import-onboarding-option-list__item"}>
              <AccountImportOnboardingOptionListItemContent
                icon={icon}
                title={title}
                description={description}
                shouldShowNew={shouldShowNew}
                shouldShowComingSoon={shouldShowComingSoon}
              />
            </LinkButton>
          )}
        </ListItem>
      )}
    </List>
  );

  function handleOptionClick(event: SyntheticEvent<HTMLButtonElement>) {
    onOptionClick!(event.currentTarget.id as typeof accountOptions[number]["id"]);
  }
}

export default AccountImportOnboardingOptionList;
