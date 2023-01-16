import "./_account-import-pera-sync-prepare.scss";

import {ReactComponent as PeraSyncIcon} from "../../../../../core/ui/icons/pera-sync.svg";

import {useEffect} from "react";

import ROUTES from "../../../../../core/route/routes";
import useAsyncProcess from "../../../../../core/network/async-process/useAsyncProcess";
import {useAppContext} from "../../../../../core/app/AppContext";
import {AccountBackup} from "../../../../accountModels";
import {peraApi} from "../../../../../core/util/pera/api/peraApi";
import {useSimpleToaster} from "../../../../../component/simple-toast/util/simpleToastHooks";
import {useModalDispatchContext} from "../../../../../component/modal/context/ModalContext";
import PasswordAccessPage, {
  PASSWORD_ACCESS_MODAL_ID
} from "../../../../../password/page/access/PasswordAccessPage";
import useNavigateFlow from "../../../../../core/route/navigate/useNavigateFlow";
import {AccountComponentFlows} from "../../../../util/accountTypes";
import {useConnectFlowContext} from "../../../../../connect/context/ConnectFlowContext";
import Button from "../../../../../component/button/Button";
import {STORED_KEYS} from "../../../../../core/util/storage/web/webStorage";
import {encryptedWebStorageUtils} from "../../../../../core/util/storage/web/webStorageUtils";

interface AccountImportPeraSyncProps {
  flow?: AccountComponentFlows;
}

function AccountImportPeraSync({flow = "default"}: AccountImportPeraSyncProps) {
  const navigate = useNavigateFlow();
  const {
    state: {masterkey, preferredNetwork}
  } = useAppContext();
  const dispatchModalStateAction = useModalDispatchContext();
  const {dispatchFormitoAction} = useConnectFlowContext();
  const {
    runAsyncProcess,
    state: {data, error, isRequestPending}
  } = useAsyncProcess<AccountBackup>();
  const simpleToaster = useSimpleToaster();

  useEffect(() => {
    if (data) {
      const {id: backupId, modification_key: modificationKey} = data;

      if (flow === "connect") {
        dispatchFormitoAction({
          type: "SET_FORM_VALUE",
          payload: {
            importAccountFromMobileViews: "qr",
            accountBackup: {
              backupId,
              modificationKey
            }
          }
        });
      } else {
        navigate(ROUTES.ACCOUNT.IMPORT.PERA_SYNC.QR.ROUTE, {
          state: {backupId, modificationKey}
        });
      }
    }

    if (error) {
      simpleToaster.display({
        type: "error",
        message: "There was an error importing your accounts, please try again later."
      });
    }
  }, [data, error, navigate, simpleToaster, dispatchFormitoAction, flow]);

  return (
    <div className={"account-import-pera"}>
      <PeraSyncIcon className={"account-import-pera__icon"} />

      <h1 className={"account-import-pera__title"}>{"Import from Pera Mobile"}</h1>

      <p className={"account-import-pera__description"}>
        {
          "If you are already a Pera Mobile user you can import all your accounts to Pera Web at once."
        }
      </p>

      <Button
        customClassName={"account-import-pera__cta typography--medium-body"}
        size={"large"}
        onClick={handleOpenPasswordModal}
        shouldDisplaySpinner={isRequestPending}>
        {"I understand, proceed"}
      </Button>
    </div>
  );

  function handleOpenPasswordModal() {
    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: PASSWORD_ACCESS_MODAL_ID,
          modalContentLabel: "Start account import process from pera mobile",
          children: (
            <PasswordAccessPage
              type={"modal"}
              title={"Enter Passcode"}
              ctaText={"Proceed"}
              onSubmit={handleRequestAccountBackup}
              hasCancelButton={true}
              onCancel={closeModal}
            />
          )
        }
      }
    });
  }

  async function handleRequestAccountBackup() {
    try {
      closeModal();

      const deviceInfo = (await encryptedWebStorageUtils(masterkey!).get(
        STORED_KEYS.DEVICE_INFO
      )) as DeviceInfo;

      const {deviceId} = deviceInfo[preferredNetwork];

      runAsyncProcess(peraApi.createAccountBackup(deviceId));
    } catch (e) {
      simpleToaster.display({
        type: "error",
        message: "Network error happened, please try again later."
      });
    }
  }

  function closeModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {
        id: PASSWORD_ACCESS_MODAL_ID
      }
    });
  }
}

export default AccountImportPeraSync;
