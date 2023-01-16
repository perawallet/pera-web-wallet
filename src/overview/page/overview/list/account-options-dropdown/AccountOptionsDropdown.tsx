import "./_account-options-dropdown.scss";

import {ReactComponent as MoreIcon} from "../../../../../core/ui/icons/more.svg";

import React from "react";
import {useNavigate} from "react-router-dom";
import {Select, List} from "@hipo/react-ui-toolkit";

import {ACCOUNT_DROPDOWN_OPTIONS} from "./accountOptionsDropdownConstants";
import useClipboard from "../../../../../component/clipboard/useClipboard";
import {useSimpleToaster} from "../../../../../component/simple-toast/util/simpleToastHooks";
import {useModalDispatchContext} from "../../../../../component/modal/context/ModalContext";
import AccountRemoveModal, {
  ACCOUNT_REMOVE_MODAL_ID
} from "../../../../../account/component/account-remove-modal/AccountRemoveModal";
import AccountRenameModal, {
  ACCOUNT_RENAME_MODAL_ID
} from "../../../../../account/component/account-rename-modal/AccountRenameModal";
import {useAppContext} from "../../../../../core/app/AppContext";
import AccountShowQRModal, {
  ACCOUNT_SHOW_QR_MODAL_ID
} from "../../../show-qr/AccountShowQR";
import AccountShowPassphraseModal, {
  ACCOUNT_SHOW_PASSPHRASE_MODAL_ID
} from "../../../show-passphrase/AccountShowPassphrase";
import PasswordAccessPage, {
  PASSWORD_ACCESS_MODAL_ID
} from "../../../../../password/page/access/PasswordAccessPage";
import ROUTES from "../../../../../core/route/routes";
import AssetOptinInfoModal from "../../../../../asset/opt-in/modal/info/AssetOptinInfoModal";
import {ASSET_OPTIN_INFO_MODAL_ID} from "../../../../../asset/opt-in/modal/info/util/assetOptinInfoModalConstants";
import webStorage, {STORED_KEYS} from "../../../../../core/util/storage/web/webStorage";
import {ASSET_OPTIN_PAGE_SEARCH_PARAM} from "../../../../../asset/opt-in/page/AssetOptinPage";

interface AccountOptionsDropdownProps {
  address: AccountOverview["address"];
}

export type AccountDropdownOption = {id: string; title: string; icon: React.ReactNode};

function AccountOptionsDropdown({address}: AccountOptionsDropdownProps) {
  const navigate = useNavigate();
  const {
    state: {accounts}
  } = useAppContext();
  const {copyToClipboard} = useClipboard();
  const simpleToaster = useSimpleToaster();
  const dispatchModalStateAction = useModalDispatchContext();

  return (
    <Select
      role={"menu"}
      customClassName={"account-options-dropdown"}
      options={[...ACCOUNT_DROPDOWN_OPTIONS]}
      value={null}
      onSelect={handleOptionSelect}>
      <Select.Trigger
        customClassName={"button button--light account-overview-dropdown__header-button"}>
        <MoreIcon />
      </Select.Trigger>

      <Select.Content>
        <List
          items={[...ACCOUNT_DROPDOWN_OPTIONS]}
          customClassName={"account-options-dropdown__list"}>
          {(option) => (
            <Select.Item
              option={option}
              as={"li"}
              customClassName={"account-options-dropdown__list-item"}>
              {option.icon}

              <p className={"typography--caption"}>{option.title}</p>
            </Select.Item>
          )}
        </List>
      </Select.Content>
    </Select>
  );

  function handleOptionSelect(option: AccountDropdownOption | null) {
    if (!option) return;

    switch (option.id as typeof ACCOUNT_DROPDOWN_OPTIONS[number]["id"]) {
      case "copy-address":
        copyToClipboard(address);

        simpleToaster.display({
          message: "Account address copied!",
          type: "success"
        });
        break;

      case "show-qr":
        dispatchModalStateAction({
          type: "OPEN_MODAL",
          payload: {
            item: {
              id: ACCOUNT_SHOW_QR_MODAL_ID,
              modalContentLabel: "Account QR code modal",
              children: <AccountShowQRModal address={address} onClose={closeModal} />
            }
          }
        });
        break;

      case "show-passphrase":
        dispatchModalStateAction({
          type: "OPEN_MODAL",
          payload: {
            item: {
              id: PASSWORD_ACCESS_MODAL_ID,
              modalContentLabel: "Remove Account Confirmation",
              children: (
                <PasswordAccessPage
                  onSubmit={openPassphraseModal}
                  title={"Enter Passcode"}
                  ctaText={"Proceed"}
                  hasCancelButton={true}
                  onCancel={closeModal}
                />
              )
            }
          }
        });
        break;

      case "rename-account":
        dispatchModalStateAction({
          type: "OPEN_MODAL",
          payload: {
            item: {
              id: ACCOUNT_RENAME_MODAL_ID,
              modalContentLabel: "Rename account",
              children: <AccountRenameModal account={accounts[address]} />
            }
          }
        });
        break;

      case "remove-account":
        dispatchModalStateAction({
          type: "OPEN_MODAL",
          payload: {
            item: {
              id: ACCOUNT_REMOVE_MODAL_ID,
              modalContentLabel: "Remove account",
              customClassName: "account-options-dropdown__remove-account-modal",
              children: <AccountRemoveModal account={accounts[address]} />
            }
          }
        });
        break;

      case "send-transaction":
        navigate(`${ROUTES.SEND_TXN.ROUTE}`, {
          state: {address}
        });
        break;

      case "opt-in-to-asset":
        if (webStorage.local.getItem(STORED_KEYS.HIDE_ASSET_OPTIN_INFO_MODAL)) {
          navigate({
            pathname: ROUTES.ASSET_OPTIN.ROUTE,
            search: `?${ASSET_OPTIN_PAGE_SEARCH_PARAM}=${accounts[address].address}`
          });
        } else {
          dispatchModalStateAction({
            type: "OPEN_MODAL",
            payload: {
              item: {
                id: ASSET_OPTIN_INFO_MODAL_ID,
                modalContentLabel: "Opt-in to asset",
                children: (
                  <AssetOptinInfoModal
                    account={accounts[address]}
                    displayDontShowAgain={true}
                  />
                )
              }
            }
          });
        }
        break;

      default:
        break;
    }
  }

  function openPassphraseModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {
        id: PASSWORD_ACCESS_MODAL_ID
      }
    });

    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: ACCOUNT_SHOW_PASSPHRASE_MODAL_ID,
          modalContentLabel: "Account QR code modal",
          children: <AccountShowPassphraseModal address={address} onClose={closeModal} />
        }
      }
    });
  }

  function closeModal() {
    dispatchModalStateAction({
      type: "CLOSE_ALL_MODALS"
    });
  }
}

export default AccountOptionsDropdown;
