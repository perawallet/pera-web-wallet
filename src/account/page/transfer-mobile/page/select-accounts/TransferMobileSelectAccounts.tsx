import "./_transfer-mobile-select-accounts.scss";

import {SyntheticEvent} from "react";

import GoBackButton from "../../../../../component/go-back-button/GoBackButton";
import {useAppContext} from "../../../../../core/app/AppContext";
import Button from "../../../../../component/button/Button";
import SelectableAccountList from "../../../../component/list/selectable/SelectableAccountList";
import {NO_OP} from "../../../../../core/util/array/arrayUtils";
import usePortfolioOverview from "../../../../../overview/util/hook/usePortfolioOverview";

function TransferMobileSelectAccounts() {
  const {
    state: {accounts}
  } = useAppContext();
  const portfolioOverview = usePortfolioOverview();

  return (
    <>
      <GoBackButton text={"Select accounts to transfer"} />

      <p className={"transfer-mobile-accounts__subheader text-color--gray-light"}>
        {"Select your accounts to transfer to Pera Mobile"}
      </p>

      <form
        onSubmit={handleAccountExporting}
        className={"transfer-mobile-accounts__select-form"}>
        <SelectableAccountList
          accounts={portfolioOverview!.accounts}
          toggleAllCheckboxContent={
            <span className={"text-color--gray-light"}>
              {`${portfolioOverview!.accounts.length} accounts available`}
            </span>
          }
          isMultipleSelect={true}
          isInitiallyAllChecked={true}
          onSelect={NO_OP}
        />

        <Button
          size={"large"}
          type={"submit"}
          customClassName={"transfer-mobile-accounts__select-form-cta"}>
          {"Continue"}
        </Button>
      </form>
    </>
  );

  function handleAccountExporting(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const selectedAccounts = [] as AppDBAccount[];

    for (const selectedAccountAddress of formData.values()) {
      selectedAccounts.push(accounts[selectedAccountAddress as string]);
    }

    // // TODO: encrypt accounts here after mobile team meeting and send it to backup endpoint
    console.log(selectedAccounts);
  }
}

export default TransferMobileSelectAccounts;
