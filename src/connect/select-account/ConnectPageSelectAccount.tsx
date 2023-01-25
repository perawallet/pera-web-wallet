import {ReactComponent as DAppIcon} from "../../core/ui/icons/dapp.svg";

import "./_connect-page-select-account.scss";

import {useEffect} from "react";
import classNames from "classnames";
import {useToaster} from "@hipo/react-ui-toolkit";

import Button from "../../component/button/Button";
import Image from "../../component/image/Image";
import {useAppContext} from "../../core/app/AppContext";
import {useConnectFlowContext} from "../context/ConnectFlowContext";
import PeraLoader from "../../component/loader/pera/PeraLoader";
import {getChainIdForNetwork} from "../../core/util/algod/algodUtils";
import PeraToast from "../../component/pera-toast/PeraToast";
import {NETWORK_MISMATCH_MESSAGE} from "../../core/util/algod/algodConstants";
import ConnectPageAccountList from "./account-list/ConnectPageAccountList";

interface ConnectPageSelectAccountProps {
  handleConnectClick: VoidFunction;
  sendNetworkMismacthError: VoidFunction;
  shouldShowToast?: boolean;
}

function ConnectPageSelectAccount({
  handleConnectClick,
  sendNetworkMismacthError,
  shouldShowToast = false
}: ConnectPageSelectAccountProps) {
  const {
    state: {accounts, preferredNetwork}
  } = useAppContext();
  const {
    formitoState: {
      currentSession,
      hasMessageReceived,
      selectedAccounts,
      isConnectStarted
    },
    dispatchFormitoAction
  } = useConnectFlowContext();
  const accountsArray = Object.values(accounts);
  const accountCount = accountsArray.length || 0;
  const hasNetworkMismatch = Boolean(
    currentSession?.chainId &&
      currentSession.chainId !== getChainIdForNetwork(preferredNetwork)
  );

  const toaster = useToaster();

  useEffect(() => {
    if (hasNetworkMismatch) {
      sendNetworkMismacthError();

      if (shouldShowToast) {
        toaster.display({
          render() {
            return (
              <PeraToast
                type={"warning"}
                title={"Network Mismatch"}
                detail={NETWORK_MISMATCH_MESSAGE}
              />
            );
          }
        });
      }
    }
  }, [hasNetworkMismatch, sendNetworkMismacthError, toaster, shouldShowToast]);

  useEffect(() => {
    if (currentSession && accountCount === 1 && !isConnectStarted) {
      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {
          selectedAccounts: accountsArray
        }
      });
    }
  }, [
    currentSession,
    accountsArray,
    dispatchFormitoAction,
    isConnectStarted,
    accountCount
  ]);

  useEffect(() => {
    if (
      accountCount === 1 &&
      selectedAccounts?.length === accountCount &&
      !isConnectStarted
    ) {
      handleConnectClick();
    }
  }, [accountCount, selectedAccounts, handleConnectClick, isConnectStarted]);

  if (hasMessageReceived && currentSession && accountCount > 1) {
    return (
      <div className={"connect-page-select-account__content"}>
        <div className={"connect-page-select-account__app-information"}>
          <div className={"connect-page-select-account__app-meta"}>
            {currentSession?.favicon ? (
              <Image
                customClassName={"connect-page-select-account__app-meta__favicon"}
                src={currentSession?.favicon}
                alt={currentSession?.title}
              />
            ) : (
              <DAppIcon className={"connect-page-select-account__app-meta__favicon"} />
            )}

            <h3
              className={
                "typography--small-subhead connect-page-select-account__app-meta__title "
              }>
              {currentSession?.title}
              <span
                className={
                  "text-color--gray connect-page-select-account__app-meta__title__sub"
                }>
                {" wants to connect to your account"}
              </span>
            </h3>

            <a
              className={
                "typography--medium-body connect-page-select-account__app-meta__url"
              }
              href={currentSession?.url}
              target={"_blank"}
              rel={"noopener noreferrer"}>
              {currentSession?.url}
            </a>
          </div>

          <div
            className={
              "has-space-between connect-page-select-account__select-account-text-wrapper"
            }>
            <div
              className={
                "text-color--gray connect-page-select-account__select-account-text"
              }>
              {`Select Account (${accountCount})`}
            </div>

            <Button
              customClassName={"connect-page-select-account__select-all-button"}
              onClick={handleSelectAllAccounts}
              buttonType={"ghost"}>
              {selectedAccounts?.length === accountsArray.length
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>

          <ConnectPageAccountList />
        </div>

        <div
          className={classNames("connect-page-select-account__connect-button-wrapper", {
            "connect-page-select-account__connect-button-wrapper--border":
              // eslint-disable-next-line no-magic-numbers
              accountsArray.length >= 2
          })}>
          <Button
            buttonType={"primary"}
            customClassName={"connect-page-select-account__connect-button"}
            isDisabled={
              !selectedAccounts || selectedAccounts?.length === 0 || hasNetworkMismatch
            }
            shouldDisplaySpinner={isConnectStarted}
            onClick={handleConnectClick}>
            {"Connect"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={"connect-page-select-account__spinner-wrapper"}>
      <PeraLoader mode={"colorful"} />

      {!currentSession && (
        <h1
          className={
            "typography--subhead text--color-main connect-page-select-account__please-wait-text"
          }>
          {"Establishing connection..."}
        </h1>
      )}

      {currentSession && accountCount === 1 && (
        <h1
          className={
            "typography--subhead text--color-main connect-page-select-account__please-wait-text"
          }>
          {`Connecting you to ${currentSession.title}...`}
        </h1>
      )}
    </div>
  );

  function handleSelectAllAccounts() {
    if (selectedAccounts?.length === accountCount) {
      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {
          selectedAccounts: []
        }
      });
    } else {
      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {
          selectedAccounts: accountsArray
        }
      });
    }
  }
}

export default ConnectPageSelectAccount;
