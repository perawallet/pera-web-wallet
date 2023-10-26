import "./_send-txn-address-input.scss";

import {isValidAddress} from "algosdk";
import {useEffect, useRef, useState} from "react";
import {FormField, TypeaheadInput} from "@hipo/react-ui-toolkit";

import {useSendTxnFlowContext} from "../../../context/SendTxnFlowContext";
import SelectableAccountList, {
  SelectableAccountListProps
} from "../../../../account/component/list/selectable/SelectableAccountList";
import {usePortfolioContext} from "../../../../overview/context/PortfolioOverviewContext";
import {PERA_NFDOMAINS_RGX} from "../../../../core/util/pera/api/peraApiConstants";
import {peraApi} from "../../../../core/util/pera/api/peraApi";
import useAsyncProcess from "../../../../core/network/async-process/useAsyncProcess";
import {AccountNameService} from "../../../../core/util/pera/api/peraApiModels";
import {INITIAL_ASYNC_PROCESS_STATE} from "../../../../core/network/async-process/asyncProcessConstants";

function SendTxnAddressInput() {
  const {accounts = {}} = usePortfolioContext() || {};
  const {
    formitoState: {senderAddress, recipientAddress},
    dispatchFormitoAction
  } = useSendTxnFlowContext();
  const {[senderAddress || ""]: senderAccount, ...filteredAccounts} = accounts;
  const accountsRef = useRef(Object.values(filteredAccounts));
  const [filteredAccountList, setFilteredAccountList] = useState<
    SelectableAccountListProps["accounts"]
  >(accountsRef.current);
  const {
    runAsyncProcess,
    state: {data},
    setState: setAsyncState
  } = useAsyncProcess<ListRequestResponse<AccountNameService>>({
    shouldResetDataWhenPending: true
  });

  const shouldDisplayAccountSelect =
    !isValidAddress(recipientAddress || "") && filteredAccountList.length > 0;

  useEffect(() => {
    if (!recipientAddress || (recipientAddress && isValidAddress(recipientAddress))) {
      setAsyncState(INITIAL_ASYNC_PROCESS_STATE);

      return;
    }

    if (data && data.results.length > 0) {
      setFilteredAccountList((oldState) => [
        ...oldState,
        ...data.results.map((account) => ({
          address: account.address,
          domainName: {
            name: account.name,
            source: account.service.name,
            image: account.service.logo
          }
        }))
      ]);
    }
  }, [data, recipientAddress, setAsyncState]);

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
        value={recipientAddress}
      />

      {shouldDisplayAccountSelect && (
        <FormField
          label={data && data.results.length ? "Domains" : "My Accounts"}
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

  function handleOnAccountSelect(selectedAddress: string) {
    setFilteredAccountList([]);

    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {recipientAddress: selectedAddress}
    });
  }

  function handleAddressChange(value: string) {
    if (PERA_NFDOMAINS_RGX.test(value)) {
      runAsyncProcess(peraApi.getNFDomains(value));
    }

    const queriedAccounts: SelectableAccountListProps["accounts"] = [];
    const query = value.toLowerCase();

    for (const portfolioAccount of accountsRef.current) {
      const {address, name: accountName} = portfolioAccount;

      if (
        address !== senderAddress &&
        (address.toLowerCase().includes(query) ||
          (accountName && accountName.toLowerCase().includes(query)))
      ) {
        queriedAccounts.push(portfolioAccount);
      }
    }

    setFilteredAccountList(queriedAccounts);
    dispatchFormitoAction({type: "SET_FORM_VALUE", payload: {recipientAddress: value}});
  }
}

export default SendTxnAddressInput;
