import "./_send-txn-select-account.scss";

import {useNavigate} from "react-router-dom";

import GoBackButton from "../../../component/go-back-button/GoBackButton";
import ROUTES from "../../../core/route/routes";
import {useSendTxnFlowContext} from "../../context/SendTxnFlowContext";
import {usePortfolioContext} from "../../../overview/context/PortfolioOverviewContext";
import SearchableAccountList from "../../../account/component/list/searchable/SearchableAccountList";

function SendTxnSelectAccount() {
  const navigate = useNavigate();
  const {
    formitoState: {senderAddress},
    dispatchFormitoAction
  } = useSendTxnFlowContext();
  const portfolioOverview = usePortfolioContext();

  return (
    <div className={"send-txn__account"}>
      <GoBackButton
        text={"Select Account"}
        customClassName={"send-txn__account__go-back-button"}
      />

      <SearchableAccountList
        accounts={portfolioOverview!.accounts}
        onSelectAccount={handleSelectAccount}
      />
    </div>
  );

  function handleSelectAccount(address: string) {
    if (!portfolioOverview) return;

    if (senderAddress !== address) {
      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {
          senderAddress: address,
          recipientAddress: undefined,
          selectedAsset: undefined,
          txnAmount: undefined,
          minBalance: undefined
        }
      });
    }

    navigate(ROUTES.SEND_TXN.ROUTE);
  }
}

export default SendTxnSelectAccount;
