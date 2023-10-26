import "./_account-import-landing-page.scss";

import AccountImportOnboardingOptionList from "../../component/onboarding-option-list/AccountImportOnboardingOptionList";
import {withGoBackLink} from "../../../core/route/context/NavigationContext";
import ROUTES from "../../../core/route/routes";

function AccountImportLandingPage({title, subtitle}: {title: string; subtitle?: string}) {
  return (
    <div className={"account-import-landing-page"}>
      <h1
        className={
          "typography--display text-color--main account-import-landing-page__title"
        }>
        {title}
      </h1>

      {!!subtitle && (
        <p
          className={
            "account-import-landing-page__subtitle typography--body text-color--main"
          }>
          {subtitle}
        </p>
      )}

      <AccountImportOnboardingOptionList layout={"vertical"} />
    </div>
  );
}

export default withGoBackLink(AccountImportLandingPage, ROUTES.ACCOUNT.ROUTE);
