import {useCallback, useEffect} from "react";

import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import peraOnrampManager from "../pera/onramp/peraOnrampManager";
import AddFundsOptinModal, {
  ADD_FUNDS_OPT_IN_MODAL_ID
} from "../../../add-funds/opt-in/AddFundsOptinModal";

function useAddFunds() {
  const simpleToaster = useSimpleToaster();
  const dispatchModalStateAction = useModalDispatchContext();

  useEffect(() => {
    peraOnrampManager.on({
      OPT_IN_REQUEST: ({accountAddress, assetID}) => {
        peraOnrampManager.close();

        dispatchModalStateAction({
          type: "OPEN_MODAL",
          payload: {
            item: {
              id: ADD_FUNDS_OPT_IN_MODAL_ID,
              children: <AddFundsOptinModal assetID={assetID} address={accountAddress} />,
              modalContentLabel: "Opt-in to asset"
            }
          }
        });
      },
      ADD_FUNDS_FAILED: () => {
        simpleToaster.display({
          type: "error",
          message: "Add funds with Pera Onramp failed"
        });
      }
    });
  }, [dispatchModalStateAction, simpleToaster]);

  const open = useCallback(
    (accountAddress: string) => {
      peraOnrampManager
        .addFunds({
          accountAddress
        })
        .then(() => {
          simpleToaster.display({
            type: "success",
            message: `Add funds with Pera Onramp completed`
          });
        })
        .catch((error) => {
          if (
            error.data.type !== "MODAL_CLOSED_PROGRAMMATICALLY" &&
            error.data.type !== "MODAL_CLOSED_BY_USER"
          ) {
            simpleToaster.display({
              type: "error",
              message: `${error}`
            });
          }
        });
    },
    [simpleToaster]
  );

  return {
    open,
    close: peraOnrampManager.close
  };
}

export default useAddFunds;
