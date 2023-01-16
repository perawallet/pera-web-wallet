import Teller from "../../network/teller/Teller";
import {PeraWalletTransaction} from "../../util/model/peraWalletModel";

export type PeraTeller =
  | {
      type: "CONNECT";
      data: AppSession;
    }
  | {
      type: "CONNECT_CALLBACK";
      data: {
        name?: string;
        addresses: string[];
      };
    }
  | {
      type: "CONNECT_NETWORK_MISMATCH";
      error: string;
    }
  | {
      type: "CREATE_PASSCODE_EMBEDDED";
    }
  | {
      type: "SELECT_ACCOUNT_EMBEDDED";
    }
  | {
      type: "CREATE_PASSCODE_EMBEDDED_CALLBACK";
    }
  | {
      type: "SELECT_ACCOUNT_EMBEDDED_CALLBACK";
    }
  | {
      type: "SIGN_TXN";
      txn: PeraWalletTransaction[];
    }
  | {
      type: "SIGN_TXN_CALLBACK";
      signedTxns: SignedTxn[];
    }
  | {
      type: "SIGN_TXN_NETWORK_MISMATCH";
      error: string;
    }
  | {
      type: "SIGN_TXN_CALLBACK_ERROR";
      error: string;
    }
  | {
      type: "SESSION_DISCONNECTED";
      error: string;
    }
  | {
      type: "TAB_OPEN";
    }
  | {
      type: "TAB_OPEN_RECEIVED";
    };

const appTellerManager = new Teller<PeraTeller>({
  channel: "pera-web-wallet"
});

export default appTellerManager;
