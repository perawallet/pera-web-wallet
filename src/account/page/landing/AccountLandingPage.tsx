import "./_account-landing-page.scss";

import {withGoBackLink} from "../../../core/route/context/NavigationContext";
import ROUTES from "../../../core/route/routes";
import AccountPageOnboardingOptionList from "../../../overview/page/welcome/account-page-onboarding-option-list/AccountPageOnboardingOptionList";

function AccountLandingPage({title, subtitle}: {title: string; subtitle?: string}) {
  return (
    <>
      <h1 className={"typography--display text-color--main account-landing-page__title"}>
        {title}
      </h1>

      {!!subtitle && (
        <p className={"account-landing-page__subtitle typography--body text-color--main"}>
          {subtitle}
        </p>
      )}

      <AccountPageOnboardingOptionList shouldShowIllustrations={true} />
    </>
  );
}

export default withGoBackLink(AccountLandingPage, ROUTES.OVERVIEW.ROUTE);
