import {ReactComponent as EmptyWalletIcon} from "../../../../core/ui/icons/empty-wallet.svg";
import {ReactComponent as PlusIcon} from "../../../../core/ui/icons/plus.svg";

import "./_empty-account-list.scss";

import LinkButton from "../../../../component/button/LinkButton";
import ROUTES from "../../../../core/route/routes";

function EmptyAccountList() {
  return (
    <div className={"empty-account-list"}>
      <EmptyWalletIcon width={36} height={36} />

      <p className={"typography--subhead text-color--gray"}>
        {"You have no accounts yet"}
      </p>

      <p className={"typography--subhead text-color--gray"}>
        {"Add your first account to Pera Web"}
      </p>

      <LinkButton to={ROUTES.ACCOUNT.ROUTE} customClassName={"empty-account-list__cta"}>
        <PlusIcon width={20} height={20} />

        {"Add Acccount"}
      </LinkButton>
    </div>
  );
}

export default EmptyAccountList;
