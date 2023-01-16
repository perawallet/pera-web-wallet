import "./_card-layout.scss";

import {Outlet} from "react-router-dom";

interface CardLayoutProps {
  hasOverlay?: boolean;
}

function CardLayout({hasOverlay = false}: CardLayoutProps) {
  return hasOverlay ? (
    <div className={"card-layout-overlay"}>
      <div className={"card-layout-content"}>
        <Outlet />
      </div>
    </div>
  ) : (
    <div className={"card-layout"}>
      <Outlet />
    </div>
  );
}

export default CardLayout;
