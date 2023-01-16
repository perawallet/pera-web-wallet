import {Dispatch} from "react";

export interface SidebarState {
  isSidebarDisable: boolean;
  isSidebarVisible: boolean;
}

export interface SidebarContextType {
  state: SidebarState;
  dispatch: Dispatch<SidebarStateReducerAction>;
}

export const initialSidebarState: SidebarState = {
  isSidebarDisable: false,
  isSidebarVisible: true
};

export type SidebarStateReducerAction = {
  type: "SET_SIDEBAR_STATUS";
  status: "visible" | "hidden" | "disabled";
};

function sidebarStateReducer(state: SidebarState, action: SidebarStateReducerAction) {
  let newState = state;

  switch (action.type) {
    case "SET_SIDEBAR_STATUS": {
      if (action.status === "visible") {
        newState = {...state, isSidebarVisible: true};
      } else if (action.status === "hidden") {
        newState = {...state, isSidebarVisible: false};
      } else if (action.status === "disabled") {
        newState = {...state, isSidebarDisable: true};
      }

      break;
    }

    default:
      break;
  }

  return newState;
}

export {sidebarStateReducer};
