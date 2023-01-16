import {ReactComponent as LedgerIcon} from "../../../core/ui/icons/ledger.svg";

import "./_account-landing-page.scss";

import AccountOnboardingOptionList from "../../component/onboarding-option-list/AccountOnboardingOptionList";
import {withGoBackLink} from "../../../core/route/context/NavigationContext";
import ROUTES from "../../../core/route/routes";

function AccountLandingPage() {
  return (
    <div>
      <h1 className={"typography--display text-color--main"}>{"Add Account"}</h1>

      <AccountOnboardingOptionList
        shouldShowIllustrations={true}
        customClassName={"account-landing-page__option-list"}
      />

      <div className={"account-landing-page__nano-ledger"}>
        <LedgerIcon />

        <p className={"typography--subhead text-color--gray-light"}>
          {"Pair Nano Ledger"}
        </p>

        <div
          className={
            "typography--tagline text-color--gray account-landing-page__nano-ledger__badge"
          }>
          {"COMING SOON"}
        </div>
      </div>
    </div>
  );
}

export default withGoBackLink(AccountLandingPage, ROUTES.OVERVIEW.ROUTE);
