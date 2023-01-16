import "./_send-txn-address-input.scss";

import {useState} from "react";
import {isValidAddress} from "algosdk";
import {FormField, TypeaheadInput} from "@hipo/react-ui-toolkit";

import {useSendTxnFlowContext} from "../../../context/SendTxnFlowContext";
import SelectableAccountList from "../../../../account/component/list/selectable/SelectableAccountList";
import {usePortfolioContext} from "../../../../overview/context/PortfolioOverviewContext";

function SendTxnAddressInput() {
  const {formitoState, dispatchFormitoAction} = useSendTxnFlowContext();
  const portfolioOverview = usePortfolioContext();
  const [filteredAccountList, setFilteredAccountList] = useState(
    portfolioOverview?.accounts.filter(
      (account) => account.address !== formitoState.senderAddress
    ) || []
  );

  return (
    <FormField
      label={"Recipient address"}
      customClassName={"send-txn-address__input-label"}>
      <TypeaheadInput
        customClassName={"send-txn-address__input"}
        type={"text"}
        onQueryChange={handleAddressChange}
        name={"recipientAddress"}
        placeholder={"Search or enter address"}
        value={formitoState.recipientAddress}
      />

      {filteredAccountList.length > 0 &&
        !isValidAddress(formitoState?.recipientAddress ?? "") && (
          <FormField
            label={"My Accounts"}
            customClassName={"send-txn-address__my-accounts"}>
            <SelectableAccountList
              accounts={filteredAccountList}
              onSelect={handleOnAccountSelect}
              customClassName={"send-txn-address__my-accounts-select"}
            />
          </FormField>
        )}
    </FormField>
  );

  function handleOnAccountSelect(recipientAddress: string) {
    setFilteredAccountList([]);

    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        recipientAddress
      }
    });
  }

  function handleAddressChange(value: string) {
    const query = value.toLowerCase();
    const queriedAccounts =
      portfolioOverview?.accounts.filter(
        (account) =>
          account.address !== formitoState.senderAddress &&
          (account.address.toLowerCase().includes(query) ||
            (account?.accountName && account.accountName.toLowerCase().includes(query)))
      ) || [];

    setFilteredAccountList(queriedAccounts);
    dispatchFormitoAction({type: "SET_FORM_VALUE", payload: {recipientAddress: value}});
  }
}

export default SendTxnAddressInput;
