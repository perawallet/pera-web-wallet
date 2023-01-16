import {useEffect} from "react";

import appTellerManager, {PeraTeller} from "../../app/teller/appTellerManager";

function useTellerListener(
  onReceiveMessage: (event: MessageEvent<TellerMessage<PeraTeller>>) => void
) {
  useEffect(() => {
    appTellerManager.setupListener({
      onReceiveMessage
    });

    return () => appTellerManager.close();
  }, [onReceiveMessage]);
}

export default useTellerListener;
