import "./_sidebar-layout.scss";

import {Outlet, useOutletContext} from "react-router-dom";
import {useReducer} from "react";
import classNames from "classnames";

import Sidebar from "../../component/page/sidebar/Sidebar";
import {
  initialSidebarState,
  SidebarContextType,
  sidebarStateReducer
} from "./sidebarStateReducer";
import PageHeader from "../../component/page/header/PageHeader";

function SidebarLayout() {
  const [state, dispatch] = useReducer(sidebarStateReducer, initialSidebarState);

  const sidebarLayoutClassnames = classNames("sidebar-layout", {
    "sidebar-layout--is-navigation-disable": state.isSidebarDisable,
    "sidebar-layout--hidden": !state.isSidebarVisible
  });

  return (
    <div className={sidebarLayoutClassnames}>
      <PageHeader customClassName={"sidebar-layout__topbar"} />

      <div className={"sidebar-layout__content"}>
        <Sidebar />

        <div className={"sidebar-layout__body"}>
          <Outlet context={{state, dispatch}} />
        </div>
      </div>
    </div>
  );
}

export function useSidebarContext() {
  return useOutletContext<SidebarContextType>();
}

export default SidebarLayout;
