import {useEffect} from "react";

import {useAppContext} from "../../app/AppContext";
import webStorage, {STORED_KEYS} from "../storage/web/webStorage";
import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";

function useLockApp() {
  const {dispatch: dispatchAppState} = useAppContext();
  const dispatchModalStateAction = useModalDispatchContext();

  useEffect(() => {
    window.addEventListener("storage", triggerStorageEvent);

    return () => {
      window.removeEventListener("storage", triggerStorageEvent);
    };

    function triggerStorageEvent(event: StorageEvent) {
      if (event.key === STORED_KEYS.LOCK_TABS) {
        dispatchAppState({
          type: "SET_MASTERKEY",
          masterkey: undefined
        });
      }
    }
  }, [dispatchAppState]);

  function lock() {
    indexedDB.deleteDatabase("pera-wallet-assets");

    webStorage.local.setItem(STORED_KEYS.LOCK_TABS, JSON.stringify(new Date()));
    webStorage.local.removeItem(STORED_KEYS.STALE_PORTFOLIO_OVERVIEW);

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
