import {ReactComponent as ArrowRightIcon} from "../../../../core/ui/icons/arrow-right.svg";

import "./_account-page-onboarding-option-list.scss";

import {SyntheticEvent} from "react";
import {List, ListItem} from "@hipo/react-ui-toolkit";
import {Link, useLocation} from "react-router-dom";
import classNames from "classnames";

import Image from "../../../../component/image/Image";
import {useAppContext} from "../../../../core/app/AppContext";
import {
  AccountPageOnboardingOption,
  getAccountPageOnboardingOptionsList
} from "./accountPageOnboardingOptionListConstants";
import {getColorSchema} from "../../../../core/app/util/appStateUtils";
import Button from "../../../../component/button/Button";

interface AccountPageOnboardingOptionListProps {
  shouldShowIllustrations?: boolean;
  customClassName?: string;
  onOptionClick?: (id: AccountPageOnboardingOption["id"]) => void;
}

function AccountPageOnboardingOptionList({
  shouldShowIllustrations = true,
  customClassName,
  onOptionClick
}: AccountPageOnboardingOptionListProps) {
  const {
    state: {theme}
  } = useAppContext();
  const location = useLocation();
  const onboardingOptions = getAccountPageOnboardingOptionsList(getColorSchema(theme));

  return (
    <List
      items={onboardingOptions}
      customClassName={classNames(
        "account-page-onboarding-option-list",
        customClassName
      )}>
      {({id, helperText, title, to, imgSrc}) => (
        <ListItem customClassName={"account-page-onboarding-option-list__item-container"}>
          {onOptionClick ? (
            <Button id={id} buttonType={"custom"} onClick={handleOptionClick}>
              <div className={"account-page-onboarding-option-list__item"}>
                <div
                  className={"account-page-onboarding-option-list__item-title-container"}>
                  <p
                    className={
                      "typography--subhead text-color--main account-page-onboarding-option-list__item-title"
                    }>
                    {title}
                  </p>

                  <ArrowRightIcon />
                </div>
              </div>

              {shouldShowIllustrations && imgSrc && (
                <Image
                  src={imgSrc}
                  customClassName={classNames(
                    "account-page-onboarding-option-list__illustration",
                    `account-page-onboarding-option-list__illustration--${id}`
                  )}
                />
              )}

              <p
                className={
                  "typography--secondary-body text-color--gray-lighter account-page-onboarding-option-list__item-helper-text"
                }>
                {helperText}
              </p>
            </Button>
          ) : (
            <Link to={to} state={{from: location}}>
              <div className={"account-page-onboarding-option-list__item"}>
                <div
                  className={"account-page-onboarding-option-list__item-title-container"}>
                  <p
                    className={
                      "typography--subhead text-color--main account-page-onboarding-option-list__item-title"
                    }>
                    {title}
                  </p>

                  <ArrowRightIcon />
                </div>
              </div>

              {shouldShowIllustrations && imgSrc && (
                <Image
                  src={imgSrc}
                  customClassName={classNames(
                    "account-page-onboarding-option-list__illustration",
                    `account-page-onboarding-option-list__illustration--${id}`
                  )}
                />
              )}

              <p
                className={
                  "typography--secondary-body text-color--gray-lighter account-page-onboarding-option-list__item-helper-text"
                }>
                {helperText}
              </p>
            </Link>
          )}
        </ListItem>
      )}
    </List>
  );

  function handleOptionClick(event: SyntheticEvent<HTMLButtonElement>) {
    onOptionClick!(event.currentTarget.id as typeof onboardingOptions[number]["id"]);
  }
}

export default AccountPageOnboardingOptionList;
