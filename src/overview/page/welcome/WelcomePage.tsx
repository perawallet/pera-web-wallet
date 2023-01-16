import "./_welcome-page.scss";

import {Navigate} from "react-router-dom";

import AccountOnboardingOptionList from "../../../account/component/onboarding-option-list/AccountOnboardingOptionList";
import {useAppContext} from "../../../core/app/AppContext";
import {generateWelcomePageCopies} from "./util/welcomePageUtils";
import ROUTES from "../../../core/route/routes";
import RequirePassword from "../../../core/route/RequirePassword";

function WelcomePage() {
  const {
    state: {hashedMasterkey, hasAccounts}
  } = useAppContext();
  const {title, description} = generateWelcomePageCopies(!!hashedMasterkey);

  if (hasAccounts) return <Navigate replace={true} to={ROUTES.OVERVIEW.ROUTE} />;

  return renderContent();

  function renderContent() {
    let content = (
      <div>
        <h1 className={"typography--display text-color--main"}>{title}</h1>

        {description && (
          <p className={"typography--body text-color--main welcome-page__description"}>
            {description}
          </p>
        )}

        <AccountOnboardingOptionList
          shouldShowIllustrations={true}
          customClassName={"welcome-page__onboarding-option-list"}
        />
      </div>
    );

    if (hashedMasterkey) {
      content = <RequirePassword>{content}</RequirePassword>;
    }

    return content;
  }
}

export default WelcomePage;
