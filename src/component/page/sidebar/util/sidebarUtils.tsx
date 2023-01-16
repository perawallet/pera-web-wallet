import {ReactComponent as HomeIcon} from "../../../../core/ui/icons/home.svg";
import {ReactComponent as ShareIcon} from "../../../../core/ui/icons/share.svg";
import {ReactComponent as SettingsIcon} from "../../../../core/ui/icons/settings.svg";

import ROUTES from "../../../../core/route/routes";

function generateSidebarLinks(hasAnyAccounts: boolean, hasHashedMasterkey: boolean) {
  return [
    {
      id: "home",
      icon: <HomeIcon width={20} height={20} />,
      text: hasHashedMasterkey ? "Accounts" : "Home",
      to: hasAnyAccounts ? ROUTES.OVERVIEW.ROUTE : ROUTES.BASE
    },
    {
      id: "send",
      icon: <ShareIcon width={20} height={20} />,
      text: "Send",
      to: ROUTES.SEND_TXN.ROUTE
    },
    {
      id: "settings",
      icon: <SettingsIcon width={20} height={20} />,
      text: "Settings",
      to: ROUTES.SETTINGS.ROUTE
    }
  ];
}

export {generateSidebarLinks};
