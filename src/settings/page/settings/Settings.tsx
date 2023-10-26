import "./_settings.scss";

import {Outlet} from "react-router-dom";
import {List, ListItem, Toggle} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import {CHANGE_PASSCODE_MODAL_ID, SETTINGS_PAGE_ITEMS} from "./util/settingsConstants";
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
import {TRANSFER_MOBILE_INFO_MODAL_ID} from "../../transfer-mobile/modal/transferMobileInfoModalConstants";
import PasswordAccessPage, {
  PASSWORD_ACCESS_MODAL_ID
} from "../../../password/page/access/PasswordAccessPage";
import PasswordCreatePage from "../../../password/page/create/PasswordCreatePage";
import LinkButton from "../../../component/button/LinkButton";
import {BACKUP_INFO_MODAL_ID} from "../../backup/modal/backup-info-modal/backupInfoModalConstants";
import BackupInfoModal from "../../backup/modal/backup-info-modal/BackupInfoModal";
import TransferMobileInfoModal from "../../transfer-mobile/modal/TransferMobileInfoModal";

function Settings() {
  const {
    state: {preferredNetwork, sessions, theme},
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

              <div className={"settings-list-item__content"}>
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

                    {item.shouldShowNew && (
                      <span
                        className={
                          "typography--tagline settings-list-item-title__new-label"
                        }>
                        {"NEW"}
                      </span>
                    )}
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
              </div>
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

      case "theme":
        cta = (
          <Toggle
            selectedItems={[theme]}
            onToggle={toggleTheme}
            customClassName={"settings__theme-toggle"}>
            <Toggle.Item dataId={"system"}>{"System"}</Toggle.Item>
            <Toggle.Item dataId={"dark"}>{"Dark"}</Toggle.Item>
            <Toggle.Item dataId={"light"}>{"Light"}</Toggle.Item>
          </Toggle>
        );
        break;
      case "asb":
        cta = (
          <Button onClick={handleBackup} size={"medium"} buttonType={"secondary"}>
            {"Back-up now"}
          </Button>
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

              <LinkButton
                size={"medium"}
                buttonType={"secondary"}
                to={ROUTES.SETTINGS.SESSIONS.ROUTE}>
                {"View Sessions"}
              </LinkButton>
            </div>
          );
        }
        break;

      case "transfer-mobile":
        cta = (
          <Button
            buttonType={"light"}
            size={"medium"}
            onClick={handleTransferAccounts}
            customClassName={"settings__transfer-button"}>
            {"Transfer Accounts"}
          </Button>
        );
        break;

      case "change-passcode":
        cta = (
          <Button buttonType={"secondary"} size={"medium"} onClick={handleChangePasscode}>
            {"Change Passcode"}
          </Button>
        );
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

    updateAPIsPreferredNetwork(switchedNetwork);
  }

  function toggleTheme(selectedItems: string[]) {
    const switchedTheme = selectedItems[0];

    dispatchAppState({
      type: "SET_THEME",
      theme: switchedTheme as AppTheme
    });

    webStorage.local.setItem(STORED_KEYS.THEME, switchedTheme);
  }

  function handleChangePasscode() {
    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: PASSWORD_ACCESS_MODAL_ID,
          modalContentLabel: "Change Passcode",
          children: (
            <PasswordAccessPage
              type={"modal"}
              onSubmit={handleOpenChangePasscodeModal}
              title={"Enter Passcode"}
              ctaText={"Proceed"}
              hasCancelButton={true}
              onCancel={closePasswordAccessModal}
            />
          )
        }
      }
    });
  }

  function closePasswordAccessModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {id: PASSWORD_ACCESS_MODAL_ID}
    });
  }

  function handleOpenChangePasscodeModal() {
    closePasswordAccessModal();

    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: CHANGE_PASSCODE_MODAL_ID,
          children: <PasswordCreatePage type={"change"} />,
          modalContentLabel: "Change Passcode"
        }
      }
    });
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

  function handleTransferAccounts() {
    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: TRANSFER_MOBILE_INFO_MODAL_ID,
          children: <TransferMobileInfoModal />,
          modalContentLabel: "Transfer Mobile"
        }
      }
    });
  }

  function handleBackup() {
    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: BACKUP_INFO_MODAL_ID,
          children: <BackupInfoModal />,
          modalContentLabel: "Algorand Secure Backup"
        }
      }
    });
  }
}

export default Settings;
