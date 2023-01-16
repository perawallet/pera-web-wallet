import "./_sidebar.scss";

import {NavLink, NavLinkProps} from "react-router-dom";
import {List, ListItem} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import {SIDEBAR_FOOTER_LINKS, SIDEBAR_SOCIAL_LINK} from "./util/sidebarConstants";
import {useAppContext} from "../../../core/app/AppContext";
import {generateSidebarLinks} from "./util/sidebarUtils";

function Sidebar() {
  const {
    state: {hashedMasterkey, masterkey, hasAccounts}
  } = useAppContext();
  const navlinkClassnames: NavLinkProps["className"] = ({isActive}) =>
    classNames("sidebar__nav-link", {
      "sidebar__nav-link--active": isActive
    });

  return (
    <div className={"sidebar"}>
      <nav className={"sidebar__nav"}>
        <List
          customClassName={"sidebar__nav-list"}
          items={generateSidebarLinks(hasAccounts, !!hashedMasterkey)}>
          {(item) => (
            <ListItem
              customClassName={classNames(
                "typography--button",
                "text-color--main",
                "sidebar__nav-list-item",
                {
                  "sidebar__nav-list-item--disabled": !masterkey && item.id !== "home"
                }
              )}>
              <NavLink
                to={item.to}
                // eslint-disable-next-line react/jsx-no-bind
                className={navlinkClassnames}>
                {item.icon}

                {item.text}
              </NavLink>
            </ListItem>
          )}
        </List>
      </nav>

      <div className={"sidebar__footer"}>
        <List customClassName={"sidebar__footer-list"} items={SIDEBAR_FOOTER_LINKS}>
          {(item) => (
            <ListItem
              customClassName={"typography--secondary-body sidebar__footer-list-item"}>
              <a
                href={item.to}
                className={"sidebar__footer-link"}
                rel={"noopener noreferrer"}
                target={"_blank"}>
                {item.text}
              </a>
            </ListItem>
          )}
        </List>

        <List customClassName={"sidebar__footer-social-list"} items={SIDEBAR_SOCIAL_LINK}>
          {(item) => (
            <ListItem>
              <a
                href={item.to}
                className={"sidebar__footer-social-link"}
                rel={"noopener noreferrer"}
                target={"_blank"}>
                {item.icon}
              </a>
            </ListItem>
          )}
        </List>
      </div>
    </div>
  );
}

export default Sidebar;
