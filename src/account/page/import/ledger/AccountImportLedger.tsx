import nanoLedgerImgSrc from "../../../../core/ui/image/nano-ledger.png";
import {ReactComponent as BluetoothIcon} from "../../../../core/ui/icons/bluetooth.svg";

import "./_account-import-ledger.scss";

import classNames from "classnames";
import {useToaster} from "@hipo/react-ui-toolkit";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import TransportWebBLE from "@ledgerhq/hw-transport-web-ble";
import {TransportOpenUserCancelled} from "@ledgerhq/errors";

import Button from "../../../../component/button/Button";
import {ACCOUNT_IMPORT_LEDGER_PAGE_STEPS} from "./accountImportLedgerConstants";
import useFormito from "../../../../core/util/hook/formito/useFormito";
import {useModalDispatchContext} from "../../../../component/modal/context/ModalContext";
import PeraToast from "../../../../component/pera-toast/PeraToast";
import {
  generateLedgerToastErrorMessage,
  getLedgerAccountDetails
} from "./accountImportLedgerUtils";
import LedgerImportSelectAccountModal, {
  ACCOUNT_IMPORT_LEDGER_SELECT_MODAL_ID
} from "./modal/select-account/LedgerImportSelectAccountModal";
import useOnUnmount from "../../../../core/util/hook/useOnUnmount";
import LedgerDeviceSearchModal, {
  LEDGER_DEVICE_SEARCH_MODAL_ID
} from "./modal/device-search/LedgerDeviceSearchModal";
import {useConnectFlowContext} from "../../../../connect/context/ConnectFlowContext";
import AccountImportLedgerLanding from "./steps/AccountImportLedgerLanding";
import {withGoBackLink} from "../../../../core/route/context/NavigationContext";
import {HALF_MINUTE_IN_MS, MINUTE_IN_MS} from "../../../../core/util/time/timeConstants";
import Image from "../../../../component/image/Image";

type LedgerType = keyof typeof ACCOUNT_IMPORT_LEDGER_PAGE_STEPS;
type LedgerConnectionType =
  | Awaited<ReturnType<typeof TransportWebHID.create>>
  | undefined;

const initialAccountImportLedgerPageState: {
  step: number;
  ledgerType: LedgerType;
  ledgerConnection?: LedgerConnectionType;
} = {
  step: 0,
  ledgerType: "USB"
};

/* eslint-disable no-magic-numbers */
const LEDGER_TOAST_ERROR_TIMEOUT = MINUTE_IN_MS / 3;
const LEDGER_CONNECT_TIMEOUT = HALF_MINUTE_IN_MS;
/* eslint-enable no-magic-numbers */

function AccountImportLedgerPage() {
  const {
    formitoState: {step, ledgerType},
    dispatchFormitoAction
  } = useFormito(initialAccountImportLedgerPageState);
  const dispatchModalStateAction = useModalDispatchContext();
  const toaster = useToaster();

  const ledgerSteps = Object.values(ACCOUNT_IMPORT_LEDGER_PAGE_STEPS[ledgerType]);
  const {title, subtitle, ctaText} = ledgerSteps[step];
  const isLastStep = ledgerSteps.length - 1 === step;
  const {formitoState: {handleConnectClick} = {}} = useConnectFlowContext();

  useOnUnmount(() => toaster.hideAll());

  return (
    <div
      className={classNames("account-import-ledger", {
        "account-import-ledger--last-step": isLastStep
      })}>
      <div className={"account-import-ledger__context"}>
        {
          // eslint-disable-next-line no-magic-numbers
          step === 3 && ledgerType === "BLUETOOTH" && (
            <div className={"account-import-ledger__bluetooth-icon typography--tagline"}>
              <div className={"account-import-ledger__bluetooth-icon__content"}>
                <div className={"account-import-ledger__bluetooth-icon__wrapper"}>
                  <BluetoothIcon />
                </div>

                <span>{":"}</span>

                <span>{"ON"}</span>
              </div>
            </div>
          )
        }

        <div>
          <h1
            className={
              "account-import-ledger__title typography--display text-color--main"
            }>
            {title}
          </h1>

          <p className={"text-color--gray account-import-ledger__description"}>
            {subtitle}
          </p>
        </div>

        {step === 0 && (
          <AccountImportLedgerLanding handleSelectLedgerType={handleSelectLedgerType} />
        )}

        {step !== 0 && !isLastStep && (
          <div className={"account-import-ledger__steps-button-group--horizontal"}>
            <Button
              buttonType={"ghost"}
              customClassName={"account-import-ledger__cta"}
              size={"large"}
              onClick={goLastStep}>
              {"Skip Intro"}
            </Button>

            <Button
              buttonType={"secondary"}
              customClassName={"account-import-ledger__cta"}
              size={"large"}
              onClick={goNextStep}>
              {ctaText || `Next ${"  "}→`}
            </Button>
          </div>
        )}

        {isLastStep && (
          <Button
            buttonType={"primary"}
            customClassName={"account-import-ledger__cta"}
            size={"large"}
            onClick={handleConnectNanoLedger}>
            {"Search for devices"}
          </Button>
        )}
      </div>

      <Image src={nanoLedgerImgSrc} alt={"Nano Ledger"} />
    </div>
  );

  function handleSelectLedgerType(selectedLedgerType: LedgerType) {
    return () => {
      toaster.hideAll();

      toaster.display({
        render() {
          return (
            <PeraToast
              type={"info"}
              title={"Need help?"}
              detail={"You can see a tutorial on how to pair your Ledger device"}
              learnMoreLink={"https://support.perawallet.app/en/category/ledger-3og5sn/"}
            />
          );
        },
        autoClose: false
      });

      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {ledgerType: selectedLedgerType, step: 1}
      });
    };
  }

  function goNextStep() {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {step: isLastStep ? step : step + 1}
    });
  }

  function goLastStep() {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {step: ledgerSteps.length - 1}
    });
  }

  function handleConnectNanoLedger() {
    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: LEDGER_DEVICE_SEARCH_MODAL_ID,
          modalContentLabel: "Ledger Device Searching Info Modal",
          children: <LedgerDeviceSearchModal />
        }
      }
    });

    const LedgerConnection =
      ledgerType === "BLUETOOTH" ? TransportWebBLE : TransportWebHID;

    const timeout = setTimeout(
      () => handleLedgerErrorState(new TransportOpenUserCancelled()),
      LEDGER_CONNECT_TIMEOUT
    );
    const {unsubscribe} = LedgerConnection.listen({
      next: async (event) => {
        if ((event.type as "add" | "remove") === "add") {
          try {
            const connection =
              ledgerType === "USB" && event.descriptor.opened
                ? new TransportWebHID(event.descriptor)
                : await LedgerConnection.open(event.descriptor);

            await getLedgerAccountDetails(connection, {startIndex: 0, batchSize: 1});

            dispatchModalStateAction({
              type: "OPEN_MODAL",
              payload: {
                item: {
                  id: ACCOUNT_IMPORT_LEDGER_SELECT_MODAL_ID,
                  modalContentLabel: "Ledger Account Import Select Account",
                  children: (
                    <LedgerImportSelectAccountModal
                      connection={connection}
                      handleConnectClick={handleConnectClick}
                    />
                  ),
                  shouldCloseOnOverlayClick: false
                }
              }
            });
          } catch (error) {
            handleLedgerErrorState(error);
          } finally {
            closeInfoModal();
          }
        }
      },
      error: (error) => {
        closeInfoModal();
        handleLedgerErrorState(error);
      },
      complete: () => {
        unsubscribe();
        clearTimeout(timeout);
        closeInfoModal();
      }
    });
  }

  function handleLedgerErrorState(error: unknown) {
    const toastErrorMessage = generateLedgerToastErrorMessage(error);

    toaster.display({
      id: toastErrorMessage.title,
      timeout: LEDGER_TOAST_ERROR_TIMEOUT,
      render() {
        return (
          <PeraToast
            type={"info"}
            title={toastErrorMessage.title}
            detail={toastErrorMessage.detail}
          />
        );
      }
    });
  }

  function closeInfoModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {id: LEDGER_DEVICE_SEARCH_MODAL_ID}
    });
  }
}

export default withGoBackLink(AccountImportLedgerPage);
