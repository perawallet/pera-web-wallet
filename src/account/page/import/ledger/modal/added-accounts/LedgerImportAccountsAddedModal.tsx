import "./_ledger-import-accounts-added-modal.scss";

import {ReactComponent as CheckmarkIcon} from "../../../../../../core/ui/icons/checkmark.svg";

import {useNavigate} from "react-router-dom";
import {List, ListItem} from "@hipo/react-ui-toolkit";

import Button from "../../../../../../component/button/Button";
import {trimAccountAddress} from "../../../../../util/accountUtils";
import {useModalDispatchContext} from "../../../../../../component/modal/context/ModalContext";
import ROUTES from "../../../../../../core/route/routes";
import useAccountIcon from "../../../../../../core/util/hook/useAccountIcon";

export const LEDGER_IMPORT_ACCOUNTS_ADDED_MODAL_ID = "ledger-import-accounts-added-modal";

function LedgerImportAccountsAddedModal({addresses}: {addresses: string[]}) {
  const navigate = useNavigate();
  const dispatchModalAction = useModalDispatchContext();
  const {renderAccountIcon} = useAccountIcon();

  return (
    <div className={"ledger-import-accounts-added__modal"}>
      <div className={"ledger-import-accounts-added-modal__checkmark-icon-wrapper"}>
        <CheckmarkIcon width={56} height={56} />
      </div>

      <h2 className={"typography--h2"}>{"Accounts added"}</h2>

      <List
        items={addresses}
        customClassName={"ledger-import-accounts-added-modal__list"}>
        {(address) => (
          <ListItem customClassName={"ledger-import-accounts-added-modal__list-item"}>
            {renderAccountIcon({accountType: "LEDGER"})}

            <span className={"typography--medium-body text-color--main"}>
              {trimAccountAddress(address)}
            </span>

            <span
              className={
                "ledger-import-accounts-added-modal__list-item-description typography--medium-body"
              }>
              {"Ready to use"}
            </span>
          </ListItem>
        )}
      </List>

      <Button size={"large"} customClassName={"button--fluid"} onClick={handleClose}>
        {"Go to Accounts"}
      </Button>
    </div>
  );

  function handleClose() {
    dispatchModalAction({type: "CLOSE_ALL_MODALS"});

    navigate(ROUTES.OVERVIEW.ROUTE);
  }
}

export default LedgerImportAccountsAddedModal;
