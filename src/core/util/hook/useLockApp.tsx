import {useEffect} from "react";

import {useAppContext} from "../../app/AppContext";
import webStorage, {STORED_KEYS} from "../storage/web/webStorage";
import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";
import {DATABASES_CONTAINING_SENSITIVE_INFO} from "../../app/db";

function useLockApp() {
  const {dispatch: dispatchAppState} = useAppContext();
  const dispatchModalStateAction = useModalDispatchContext();

  useEffect(() => {
    window.addEventListener("storage", triggerStorageEvent);

    return () => {
      window.removeEventListener("storage", triggerStorageEvent);
    };

    function triggerStorageEvent(event: StorageEvent) {
      switch (event.key) {
        case STORED_KEYS.LOCK_TABS:
          dispatchAppState({
            type: "SET_MASTERKEY",
            masterkey: undefined
          });
          break;

        case STORED_KEYS.PREFERRED_NETWORK:
          dispatchAppState({
            type: "SET_PREFERRED_NETWORK",
            preferredNetwork: event.newValue?.includes("mainnet") ? "mainnet" : "testnet"
          });
          break;

        default:
          break;
      }
    }
  }, [dispatchAppState]);

  function lock() {
    DATABASES_CONTAINING_SENSITIVE_INFO.forEach((database) => {
      indexedDB.deleteDatabase(database);
    });

    webStorage.local.setItem(STORED_KEYS.LOCK_TABS, JSON.stringify(new Date()));

    dispatchAppState({
      type: "SET_MASTERKEY",
      masterkey: undefined
    });

    // close and remove modals when App locked
    dispatchModalStateAction({type: "CLEAN_MODAL_STACK"});
  }

  return lock;
}

export default useLockApp;
