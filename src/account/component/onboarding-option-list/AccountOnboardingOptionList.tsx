import {ReactComponent as ArrowRightIcon} from "../../../core/ui/icons/arrow-right.svg";

import "./_account-onboarding-option-list.scss";

import {List, ListItem} from "@hipo/react-ui-toolkit";
import {Link, useLocation} from "react-router-dom";
import classNames from "classnames";

import Image from "../../../component/image/Image";
import {ACCOUNT_ONBOARDING_OPTIONS} from "./util/accountOnboardingOptionListConstants";
import {useAppContext} from "../../../core/app/AppContext";

interface AccountOnboardingOptionListProps {
  shouldShowIllustrations?: boolean;
  customClassName?: string;
}

function AccountOnboardingOptionList({
  shouldShowIllustrations = false,
  customClassName
}: AccountOnboardingOptionListProps) {
  const {
    state: {hasAccounts}
  } = useAppContext();
  const location = useLocation();

  return (
    <List
      items={ACCOUNT_ONBOARDING_OPTIONS}
      customClassName={classNames("account-onboarding-option-list", customClassName)}>
      {({id, icon, helperText, title, to, imgSrc}) => (
        <ListItem customClassName={"account-onboarding-option-list__item-container"}>
          <Link to={to} state={{from: location}}>
            <div className={"account-onboarding-option-list__item"}>
              {!shouldShowIllustrations && icon}

              {!hasAccounts && (
                <p
                  className={
                    "typography--tagline text-color--gray-light text--uppercase account-onboarding-optin-list__item-helper-text"
                  }>
                  {helperText}
                </p>
              )}

              <div className={"account-onboarding-optin-list__item-title-container"}>
                <p
                  className={
                    "typography--subhead text-color--main account-onboarding-optin-list__item-title"
                  }>
                  {title}
                </p>

                <ArrowRightIcon />
              </div>
            </div>

            {shouldShowIllustrations && (
              <Image
                src={imgSrc}
                customClassName={classNames(
                  "account-onboarding-option-list__illustration",
                  `account-onboarding-option-list__illustration--${id}`
                )}
              />
            )}
          </Link>
        </ListItem>
      )}
    </List>
  );
}

export default AccountOnboardingOptionList;
