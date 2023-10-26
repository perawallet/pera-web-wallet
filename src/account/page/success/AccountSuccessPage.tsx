import checkmarkAnimation from "../../../core/ui/animation/Checkmark.json";
import checkmarkDarkAnimation from "../../../core/ui/animation/Checkmark.dark.json";

import "./_account-success-page.scss";

import {useEffect, useState} from "react";
import Lottie from "lottie-react";

import ROUTES from "../../../core/route/routes";
import AccountSuccessCard from "./card/AccountSuccessCard";
import ExploreItemList from "../../../explore/item/list/ExploreItemList";
import {getExploreItems} from "../../../explore/util/exploreUtils";
import {getLastAccountAddress} from "../../util/accountUtils";
import LinkButton from "../../../component/button/LinkButton";
import webStorage, {STORED_KEYS} from "../../../core/util/storage/web/webStorage";
import Button from "../../../component/button/Button";
import {useConnectFlowContext} from "../../../connect/context/ConnectFlowContext";
import {AccountComponentFlows} from "../../util/accountTypes";
import {appDBManager} from "../../../core/app/db";
import {useAppContext} from "../../../core/app/AppContext";

export interface AccountSuccessPageProps {
  type: "CREATE" | "IMPORT";
  flow?: AccountComponentFlows;
}

function AccountSuccessPage({type, flow = "default"}: AccountSuccessPageProps) {
  const {
    state: {masterkey, theme}
  } = useAppContext();
  const {formitoState, dispatchFormitoAction} = useConnectFlowContext();
  const [lastAddedAccount, setLastAddedAccount] = useState<AppDBAccount | undefined>();

  useEffect(() => {
    let ignore = false;

    appDBManager
      .decryptTableEntries(
        "accounts",
        masterkey!
      )("address")
      .then((accounts) => {
        if (!ignore) {
          setLastAddedAccount(accounts[getLastAccountAddress(accounts)]);
        }
      });

    return () => {
      ignore = true;
    };
  }, [masterkey]);

  useEffect(() => {
    if (type === "CREATE" && lastAddedAccount) {
      webStorage.local.setItem(STORED_KEYS.CREATED_NEW_ACCOUNT, lastAddedAccount.name);
    }
  }, [lastAddedAccount, type]);

  return (
    <section className={"account-success-page"}>
      <div className={"animation--slide-in animation--slide-in--delay--4"}>
        <Lottie
          animationData={theme === "light" ? checkmarkAnimation : checkmarkDarkAnimation}
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

      {lastAddedAccount && <AccountSuccessCard account={lastAddedAccount} />}

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
