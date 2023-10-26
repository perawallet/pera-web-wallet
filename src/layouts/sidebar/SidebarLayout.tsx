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
import PageBanner from "../../component/page/banner/PageBanner";

function SidebarLayout() {
  const [state, dispatch] = useReducer(sidebarStateReducer, initialSidebarState);

  const sidebarLayoutClassnames = classNames("sidebar-layout", {
    "sidebar-layout--is-navigation-disable": state.isSidebarDisable,
    "sidebar-layout--hidden": !state.isSidebarVisible
  });

  return (
    <div className={sidebarLayoutClassnames}>
      <div className={"page__header-wrapper sidebar-layout__topbar"}>
        <PageBanner />

        <PageHeader />
      </div>

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
