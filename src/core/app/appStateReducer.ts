import {updateAPIsPreferredNetwork} from "../api/apiUtils";
import {filterObject} from "../util/object/objectUtils";

export interface AppState extends CommonAppState {
  accounts: AppDBScheme["accounts"];
  sessions: AppDBScheme["sessions"];
  masterkey?: string;
  hasAccounts: boolean;
  hasConnection: boolean;
}

export type AppStateReducerAction =
  | {
      type: "SET_KEY";
      keys: Pick<AppState, "masterkey" | "hashedMasterkey">;
    }
  | {
      type: "SET_THEME";
      theme: AppState["theme"];
    }
  | {
      type: "SET_PREFERRED_NETWORK";
      preferredNetwork: AppState["preferredNetwork"];
    }
  | {
      type: "SET_HASHED_MASTERKEY";
      masterkey: AppState["hashedMasterkey"];
    }
  | {
      type: "SET_MASTERKEY";
      masterkey: AppState["masterkey"];
    }
  | {
      type: "SET_HAS_CONNECTION";
      hasConnection: AppState["hasConnection"];
    }
  | {
      type: "SET_ACCOUNT";
      account: ValueOf<AppState["accounts"]> | ValueOf<AppState["accounts"]>[];
    }
  | {
      type: "REMOVE_ACCOUNT";
      address: string | string[];
    }
  | {
      type: "SET_SESSION";
      session: ValueOf<AppState["sessions"]> | ValueOf<AppState["sessions"]>[];
    }
  | {
      type: "REMOVE_SESSION";
      url: string | string[];
    }
  | {
      type: "SYNC_IDB";
      payload: Pick<AppState, "accounts" | "sessions">;
    };

function appStateReducer(state: AppState, action: AppStateReducerAction) {
  let newState = state;

  switch (action.type) {
    case "SET_KEY": {
      const {masterkey, hashedMasterkey} = action.keys;

      newState = {
        ...state,
        masterkey,
        hashedMasterkey
      };

      break;
    }

    case "SET_THEME": {
      newState = {...state, theme: action.theme};

      break;
    }

    case "SET_PREFERRED_NETWORK": {
      newState = {...state, preferredNetwork: action.preferredNetwork};

      updateAPIsPreferredNetwork(action.preferredNetwork);

      break;
    }

    case "SET_MASTERKEY": {
      newState = {...state, masterkey: action.masterkey};

      break;
    }

    case "SET_HAS_CONNECTION": {
      newState = {...state, hasConnection: action.hasConnection};

      break;
    }

    case "SET_ACCOUNT": {
      const addedAccounts = Object.fromEntries(
        ([] as AppDBAccount[])
          .concat(action.account)
          .map((account) => [account.address, account])
      );

      newState = {
        ...state,
        accounts: {...state.accounts, ...addedAccounts},
        hasAccounts: true
      };

      break;
    }

    case "SET_SESSION": {
      const addedSessions = Object.fromEntries(
        ([] as AppDBSession[])
          .concat(action.session)
          .map((session) => [session.url, session])
      );

      newState = {
        ...state,
        sessions: {...state.sessions, ...addedSessions}
      };

      break;
    }

    case "REMOVE_ACCOUNT": {
      const accountAddresses = ([] as string[]).concat(action.address);
      const filteredAccounts = filterObject((key) => accountAddresses.indexOf(key) < 0)(
        state.accounts
      );

      newState = {
        ...state,
        accounts: filteredAccounts,
        hasAccounts: Object.keys(filteredAccounts).length > 0
      };

      break;
    }

    case "REMOVE_SESSION": {
      const sessionUrls = ([] as string[]).concat(action.url);
      const filteredSessions = filterObject((key) => sessionUrls.indexOf(key) < 0)(
        state.sessions
      );

      newState = {...state, sessions: filteredSessions};

      break;
    }

    case "SYNC_IDB": {
      const {accounts, sessions} = action.payload;

      newState = {...state, accounts, sessions};

      break;
    }

    default:
      break;
  }

  return newState;
}

export {appStateReducer};
