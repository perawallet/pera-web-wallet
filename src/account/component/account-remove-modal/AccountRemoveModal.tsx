import {ReactComponent as UnlinkIcon} from "../../../core/ui/icons/unlink.svg";

import "./_account-remove-modal.scss";

import {useEffect} from "react";

import Button from "../../../component/button/Button";
import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";
import {useAppContext} from "../../../core/app/AppContext";
import PasswordAccessPage, {
  PASSWORD_ACCESS_MODAL_ID
} from "../../../password/page/access/PasswordAccessPage";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import {usePortfolioContext} from "../../../overview/context/PortfolioOverviewContext";
import algod from "../../../core/util/algod/algod";
import {DEFAULT_ALGORAND_NODE_PROVIDER_TYPE} from "../../../core/util/algod/algodConstants";
import {MINUTE_IN_MS} from "../../../core/util/time/timeConstants";
import useAsyncProcess from "../../../core/network/async-process/useAsyncProcess";
import PeraLoader from "../../../component/loader/pera/PeraLoader";

interface AccountRemoveModalProps {
  account: AppDBAccount;
}

export const ACCOUNT_REMOVE_MODAL_ID = "remove-account-modal";

function AccountRemoveModal({account}: AccountRemoveModalProps) {
  const {
    state: {preferredNetwork, masterkey}
  } = useAppContext();
  const dispatchModalStateAction = useModalDispatchContext();
  const {accounts, deleteAccount} = usePortfolioContext()!;
  const simpleToaster = useSimpleToaster();
  const {
    runAsyncProcess,
    state: {data: isMainnetAuthAccount, isRequestPending}
  } = useAsyncProcess<boolean>();
  const rekeyedAccount = Object.values(accounts).find(
    (userAccount) => userAccount.rekeyed_to === account.address
  );

  useEffect(() => {
    if (rekeyedAccount) return;

    // check if any of wallet accounts if rekeyed to the account in mainnet
    algod.updateClient("mainnet", DEFAULT_ALGORAND_NODE_PROVIDER_TYPE);

    runAsyncProcess(
      algod.indexer
        .searchAccounts()
        .authAddr(account.address)
        .do()
        .then((indexerResponse) => {
          const {accounts: rekeyedAccounts} = indexerResponse as {
            accounts: {address: string}[];
          };

          return !!rekeyedAccounts.find(
            // eslint-disable-next-line max-nested-callbacks
            (rekeyedMainnetAccount) => !!accounts[rekeyedMainnetAccount.address]
          );
        })
        .finally(() => {
          algod.updateClient(preferredNetwork, DEFAULT_ALGORAND_NODE_PROVIDER_TYPE);
        })
    );
  }, [account.address, accounts, preferredNetwork, rekeyedAccount, runAsyncProcess]);

  if (isRequestPending)
    return (
      <div className={"align-center--horizontally account-remove-modal"}>
        <PeraLoader mode={"colorful"} />
      </div>
    );

  return (
    <div className={"account-remove-modal"}>
      <div className={"account-remove-modal__hero"}>
        <div className={"account-remove-modal__hero-unlink-icon-wrapper"}>
          <UnlinkIcon width={48} height={48} />
        </div>

        <h2
          className={"typography--h2 text-color--main account-remove-modal__hero-title"}>
          {"Remove account"}
        </h2>

        <p className={"typography--body text-color--gray"}>
          {"You are about to unlink your account "}
          <span
            className={
              "typography--medium-body text-color--main"
            }>{`"${account.name}"`}</span>
          {
            " from this device. This does not delete the account, but to re-add it in future, you will need to import it again with your 25 word passphrase."
          }
        </p>
      </div>

      <Button
        buttonType={"danger"}
        size={"large"}
        customClassName={"account-remove-modal__confirm-cta"}
        onClick={handleConfirmClick}>
        {"Confirm"}
      </Button>

      <Button
        buttonType={"light"}
        size={"large"}
        customClassName={"account-remove-modal__cancel-cta"}
        onClick={handleCancelClick}>
        {"Cancel"}
      </Button>
    </div>
  );

  function handleConfirmClick() {
    closeModal();

    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: PASSWORD_ACCESS_MODAL_ID,
          modalContentLabel: "Remove Account Confirmation",
          children: (
            <PasswordAccessPage
              description={"Enter your passcode to remove account"}
              ctaText={"Remove Account"}
              hasCancelButton={true}
              onSubmit={handlePasswordAccessRemoveAccount}
              onCancel={handleCancelClick}
            />
          )
        }
      }
    });
  }

  async function handlePasswordAccessRemoveAccount() {
    if (!masterkey) return;

    if (rekeyedAccount) {
      simpleToaster.display({
        timeout: MINUTE_IN_MS,
        type: "error",
        message: `You can't remove this account before removing rekeyed ${rekeyedAccount.name}`
      });

      closeModal();

      return;
    } else if (preferredNetwork === "testnet" && isMainnetAuthAccount) {
      simpleToaster.display({
        timeout: MINUTE_IN_MS,
        type: "error",
        message: `This account has accounts rekeyed to it on Mainnet.`
      });

      closeModal();

      return;
    }

    try {
      await deleteAccount(account.address);

      closeModal();

      simpleToaster.display({
        type: "success",
        message: `Account "${account.name}" removed!`
      });
    } catch (error) {
      console.error(error);

      simpleToaster.display({
        type: "error",
        message: `There is an error removing "${account.name}".`
      });
    }
  }

  function handleCancelClick() {
    closeModal();
  }

  function closeModal() {
    dispatchModalStateAction({
      type: "CLOSE_ALL_MODALS"
    });
  }
}

export default AccountRemoveModal;
