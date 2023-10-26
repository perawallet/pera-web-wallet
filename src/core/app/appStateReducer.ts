import {updateAPIsPreferredNetwork} from "../api/apiUtils";
import {filterObject} from "../util/object/objectUtils";

export interface AppState extends CommonAppState {
  sessions: AppDBScheme["sessions"];
  algoPrice?: number;
  priceChangePercentage?: number;
  masterkey?: string;
  deviceId?: string;
  hasAccounts: boolean;
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
      type: "SET_DEVICE_ID";
      deviceId: string;
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
      type: "SET_HAS_ACCOUNTS";
      hasAccounts: AppState["hasAccounts"];
    }
  | {
      type: "SET_MASTERKEY";
      masterkey: AppState["masterkey"];
    }
  | {
      type: "SET_ALGO_PRICE_AND_CHANGE";
      price: number;
      priceChangePercentage: number;
    }
  | {
      type: "SET_SESSION";
      session: ValueOf<AppState["sessions"]> | ValueOf<AppState["sessions"]>[];
    }
  | {
      type: "REMOVE_SESSION";
      url: string | string[];
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

    case "SET_DEVICE_ID": {
      newState = {...state, deviceId: action.deviceId};

      break;
    }

    case "SET_PREFERRED_NETWORK": {
      newState = {...state, preferredNetwork: action.preferredNetwork};

      updateAPIsPreferredNetwork(action.preferredNetwork);

      break;
    }

    case "SET_MASTERKEY": {
      newState = {...state, masterkey: action.masterkey};

      if (!action.masterkey) {
        newState = {...newState, sessions: {}};
      }

      break;
    }

    case "SET_ALGO_PRICE_AND_CHANGE": {
      newState = {
        ...state,
        algoPrice: action.price,
        priceChangePercentage: action.priceChangePercentage
      };

      break;
    }

    case "SET_HAS_ACCOUNTS": {
      newState = {...state, hasAccounts: action.hasAccounts};

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

    case "REMOVE_SESSION": {
      const sessionUrls = ([] as string[]).concat(action.url);
      const filteredSessions = filterObject((key) => sessionUrls.indexOf(key) < 0)(
        state.sessions
      );

      newState = {...state, sessions: filteredSessions};

      break;
    }

    default:
      break;
  }

  return newState;
}

export {appStateReducer};
