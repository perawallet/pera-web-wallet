import {ReactComponent as CheckmarkIcon} from "../../../core/ui/icons/checkmark.svg";
import "./_account-creation-animation.scss";

import {useEffect} from "react";
import {List} from "@hipo/react-ui-toolkit";

import {ACCOUNT_CREATION_LOADING_TEXTS} from "./util/accountCreationAnimationConstants";
import {shuffleArray} from "../../../core/util/array/arrayUtils";
import ROUTES from "../../../core/route/routes";
import useNavigateFlow from "../../../core/route/navigate/useNavigateFlow";
import PeraLoader from "../../../component/loader/pera/PeraLoader";
import {
  ConnectFlowState,
  useConnectFlowContext
} from "../../../connect/context/ConnectFlowContext";
import {AccountComponentFlows} from "../../util/accountTypes";

interface AccountCreationAnimationProps {
  type: "CREATE" | "IMPORT";
  flow?: AccountComponentFlows;
  successMessage?: string;
}

const ANIMATION_TIMEOUT = 4000;

function AccountCreationAnimation({
  type,
  flow = "default",
  successMessage = "Account created!"
}: AccountCreationAnimationProps) {
  const {dispatchFormitoAction} = useConnectFlowContext();
  const randomizedLoadingTexts = shuffleArray(
    ACCOUNT_CREATION_LOADING_TEXTS
    // eslint-disable-next-line no-magic-numbers
  ).slice(0, 2);
  const navigate = useNavigateFlow();

  useEffect(() => {
    const timeout = setTimeout(() => {
      // default is CREATE
      let formitoActionPayload = {
        createAccountViews: "success"
      } as Partial<ConnectFlowState>;
      let navigateTo = ROUTES.ACCOUNT.CREATE.SUCCESS.FULL_PATH as string;

      if (type === "IMPORT") {
        formitoActionPayload = {importAccountViews: "success"};
        navigateTo = ROUTES.ACCOUNT.IMPORT.PASSPHRASE.SUCCESS.FULL_PATH;
      }

      if (flow !== "connect") {
        navigate(navigateTo);
        return;
      }

      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: formitoActionPayload
      });
    }, ANIMATION_TIMEOUT);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate, type, dispatchFormitoAction, flow]);

  return (
    <div className={"account-creation-animation"}>
      <div className={"account-creation-animation__icon-wrapper"}>
        <PeraLoader
          mode={"colorful"}
          customClassName={"account-creation-animation__icon--lottie"}
        />

        <CheckmarkIcon className={"account-creation-animation__icon--checkmark"} />
      </div>

      <List
        items={[...randomizedLoadingTexts, `${successMessage}`]}
        customClassName={"account-creation-animation__loading-text-list"}>
        {(item) => (
          <li
            className={
              "typography--h2 text-color--main account-creation-animation__loading-text-list-item"
            }>
            {item}
          </li>
        )}
      </List>
    </div>
  );
}

export default AccountCreationAnimation;
