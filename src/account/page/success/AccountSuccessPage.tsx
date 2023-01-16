import checkmarkAnimation from "../../../core/ui/animation/Checkmark.json";

import "./_account-success-page.scss";

import {useEffect} from "react";
import Lottie from "lottie-react";

import ROUTES from "../../../core/route/routes";
import AccountSuccessCard from "./card/AccountSuccessCard";
import ExploreItemList from "../../../explore/item/list/ExploreItemList";
import {getExploreItems} from "../../../explore/util/exploreUtils";
import {useAppContext} from "../../../core/app/AppContext";
import {getLastAccountAddress} from "../../util/accountUtils";
import LinkButton from "../../../component/button/LinkButton";
import webStorage, {STORED_KEYS} from "../../../core/util/storage/web/webStorage";
import Button from "../../../component/button/Button";
import {useConnectFlowContext} from "../../../connect/context/ConnectFlowContext";
import {AccountComponentFlows} from "../../util/accountTypes";
export interface AccountSuccessPageProps {
  type: "CREATE" | "IMPORT";
  flow?: AccountComponentFlows;
}

function AccountSuccessPage({type, flow = "default"}: AccountSuccessPageProps) {
  const {
    state: {accounts}
  } = useAppContext();
  const {formitoState, dispatchFormitoAction} = useConnectFlowContext();
  const createdAccountName = accounts[getLastAccountAddress(accounts)].name;

  useEffect(() => {
    if (type === "CREATE") {
      webStorage.local.setItem(STORED_KEYS.CREATED_NEW_ACCOUNT, createdAccountName);
    }
  });

  return (
    <section className={"account-success-page"}>
      <div className={"animation--slide-in animation--slide-in--delay--4"}>
        <Lottie
          animationData={checkmarkAnimation}
          loop={false}
          className={"account-success-page__checkmark-animation"}
        />

        <header className={"account-success-page__header"}>
          <h1 className={"typography--display text-color--main"}>
            {`Account ${type === "CREATE" ? "created" : "imported"}`}
          </h1>

          {flow === "connect" && formitoState ? (
            <Button
              customClassName={"account-success-page__header-cta"}
              buttonType={"secondary"}
              size={"large"}
              onClick={handleChangeView}>
              {`Continue to ${formitoState.currentSession?.title}`}
            </Button>
          ) : (
            <LinkButton
              buttonType={"secondary"}
              size={"large"}
              to={ROUTES.OVERVIEW.ROUTE}
              customClassName={"account-success-page__header-cta"}>
              {"Go to Accounts"}
            </LinkButton>
          )}
        </header>
      </div>

      <AccountSuccessCard type={type} />

      {type === "IMPORT" && (
        <div
          className={
            "account-success-page__explore-section animation--show-up animation--show-up--delay--12"
          }>
          <h3 className={"typography--h3 text-color--gray"}>
            {"Explore more on Algorand"}
          </h3>

          <ExploreItemList items={getExploreItems("recommended")} />
        </div>
      )}
    </section>
  );

  function handleChangeView() {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {connectFlowView: "select-account"}
    });
  }
}

export default AccountSuccessPage;
