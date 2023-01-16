import "./_settings.scss";

import {Link, Outlet} from "react-router-dom";
import {List, ListItem, Toggle} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import {SETTINGS_PAGE_ITEMS} from "./util/settingsConstants";
import {useAppContext} from "../../../core/app/AppContext";
import ROUTES from "../../../core/route/routes";
import Button from "../../../component/button/Button";
import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";
import ClearWalletDataModal, {
  CLEAR_WALLET_DATA_MODAL_ID
} from "../../component/clear-wallet-data-modal/ClearWalletDataModal";
import {updateAPIsPreferredNetwork} from "../../../core/api/apiUtils";
import useSetPageTitle from "../../../core/util/hook/useSetPageTitle";
import webStorage, {STORED_KEYS} from "../../../core/util/storage/web/webStorage";

function Settings() {
  const {
    state: {preferredNetwork, sessions},
    dispatch: dispatchAppState
  } = useAppContext();
  const dispatchModalStateAction = useModalDispatchContext();

  useSetPageTitle("Settings");

  return (
    <>
      <p className={"typography--h1 text-color--main settings-title"}>{"Settings"}</p>

      <div className={"settings"}>
        <List
          customClassName={"settings-list"}
          items={Object.values(SETTINGS_PAGE_ITEMS)}>
          {(item) => (
            <ListItem customClassName={"settings-list-item"}>
              {item.icon}

              <div>
                <div className={"settings-list-item-title"}>
                  <p
                    className={classNames(
                      "typography--small-subhead",
                      "text-color--main",
                      `settings-list-item-title--${item.id}`
                    )}>
                    {item.title}
                  </p>
                </div>

                <p
                  className={
                    "typography--body text-color--gray settings-list-item__description"
                  }>
                  {item.description}
                </p>

                {item.learnMore && (
                  <a
                    href={item.learnMore}
                    target={"_blank"}
                    rel={"noopener noreferrer"}
                    className={"typography--button settings-list-item-learn-more"}>
                    {"Learn more →"}
                  </a>
                )}
              </div>

              {renderSettingsListItemButton(item.id)}
            </ListItem>
          )}
        </List>
      </div>

      <Outlet />
    </>
  );

  function renderSettingsListItemButton(id: typeof SETTINGS_PAGE_ITEMS[number]["id"]) {
    let cta: React.ReactNode | null = null;

    switch (id) {
      case "node":
        cta = (
          <Toggle
            selectedItems={[preferredNetwork]}
            onToggle={togglePreferredNetwork}
            customClassName={"settings__node-toggle"}>
            <Toggle.Item dataId={"mainnet"}>{"Mainnet"}</Toggle.Item>
            <Toggle.Item dataId={"testnet"}>{"Testnet"}</Toggle.Item>
          </Toggle>
        );
        break;

      case "session":
        {
          const sessionCount = Object.values(sessions).filter(
            (session) => session.network === preferredNetwork
          ).length;

          cta = (
            <div className={"settings__view-sessions"}>
              {sessionCount > 0 && (
                <span className={"settings__view-sessions-count"}>{sessionCount}</span>
              )}

              <Link
                className={"button button--secondary button--medium typography--button"}
                to={ROUTES.SETTINGS.SESSIONS.ROUTE}>
                {"View Sessions"}
              </Link>
            </div>
          );
        }
        break;

      case "clear-wallet":
        cta = (
          <Button
            buttonType={"ghost"}
            size={"medium"}
            onClick={handleClearWalletDataClick}
            customClassName={"settings__clear-button"}>
            {"Clear Wallet Data"}
          </Button>
        );
        break;

      default:
        break;
    }

    return <div className={"settings__cta-container"}>{cta}</div>;
  }

  function togglePreferredNetwork() {
    const switchedNetwork = preferredNetwork === "testnet" ? "mainnet" : "testnet";

    dispatchAppState({
      type: "SET_PREFERRED_NETWORK",
      preferredNetwork: switchedNetwork
    });

    webStorage.local.setItem(STORED_KEYS.PREFERRED_NETWORK, switchedNetwork);

    // account balances should be refetched from BE
    webStorage.local.removeItem(STORED_KEYS.STALE_PORTFOLIO_OVERVIEW);

    updateAPIsPreferredNetwork(switchedNetwork);
  }

  function handleClearWalletDataClick() {
    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: CLEAR_WALLET_DATA_MODAL_ID,
          children: <ClearWalletDataModal />,
          modalContentLabel: "Clear Wallet Data"
        }
      }
    });
  }
}

export default Settings;
