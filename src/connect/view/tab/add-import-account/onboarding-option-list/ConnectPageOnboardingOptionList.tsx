import {ReactComponent as ArrowRightIcon} from "../../../../../core/ui/icons/arrow-right.svg";

import {List, ListItem} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import {ACCOUNT_ONBOARDING_OPTIONS} from "../../../../../account/component/onboarding-option-list/util/accountOnboardingOptionListConstants";
import Image from "../../../../../component/image/Image";
import {
  ConnectFlowAddImportAccountView,
  useConnectFlowContext
} from "../../../../context/ConnectFlowContext";

interface ConnectPageOnboardingOptionListProps {
  shouldShowIllustrations?: boolean;
  customClassName?: string;
}

function ConnectPageOnboardingOptionList({
  shouldShowIllustrations = false,
  customClassName
}: ConnectPageOnboardingOptionListProps) {
  const {dispatchFormitoAction} = useConnectFlowContext();

  return (
    <List
      items={ACCOUNT_ONBOARDING_OPTIONS}
      customClassName={classNames("account-onboarding-option-list", customClassName)}>
      {({id, helperText, title, icon, imgSrc}) => (
        <ListItem
          customClassName={"account-onboarding-option-list__item-container"}
          clickableListItemProps={{
            onClick: () => {
              handleChangeView(id);
            }
          }}>
          <div className={"account-onboarding-option-list__item"}>
            {!shouldShowIllustrations && icon}

            <p
              className={
                "typography--tagline text-color--gray-light text--uppercase account-onboarding-optin-list__item-helper-text"
              }>
              {helperText}
            </p>

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
        </ListItem>
      )}
    </List>
  );

  function handleChangeView(id: string) {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        connectFlowAddImportAccountView: id as ConnectFlowAddImportAccountView
      }
    });
  }
}

export default ConnectPageOnboardingOptionList;
