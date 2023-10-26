import {ReactComponent as ArrowLeft} from "../../../../../../core/ui/icons/arrow-left.svg";
import {ReactComponent as FingerprintIcon} from "../../../../../../core/ui/icons/fingerprint.svg";

import "./_transaction-sign-arbitrary-data-view.scss";

import {List, ListItem} from "@hipo/react-ui-toolkit";

import Button from "../../../../../../component/button/Button";
import {useTransactionSignFlowContext} from "../../../../../context/TransactionSignFlowContext";
import AccountListItemContent from "../../../../../../account/component/account-list/account-list-item-content/AccountListItemContent";
import {ALGO_UNIT} from "../../../../../../core/ui/typography/typographyConstants";
import {uint8ArrayToString} from "../../../../../../core/util/blob/blobUtils";

function TransactionSignArbitraryDataView() {
  const {
    formitoState: {activeTransactionIndex, arbitraryData, currentSession, accounts},
    dispatchFormitoAction: dispatchTransactionPageAction
  } = useTransactionSignFlowContext();
  const data = arbitraryData!.data[activeTransactionIndex];

  if (arbitraryData?.data.length === 1) {
    return (
      <div
        className={
          "transaction-sign-arbitrary-data-view__container transaction-sign-arbitrary-data-view__container--single"
        }>
        <span className={"transaction-sign-arbitrary-data-view__icon-wrapper"}>
          <FingerprintIcon width={24} height={24} />
        </span>

        <h2 className={"typography--h2"}>{"Arbitrary Data"}</h2>

        <p
          className={
            "text-color--gray-light transaction-sign-arbitrary-data-view__single-description"
          }>
          {arbitraryData!.data[0].message}
        </p>

        <Button
          buttonType={"ghost"}
          customClassName={"transaction-sign-arbitrary-data-view__see-details"}
          onClick={handleChangeView}>
          {"See transaction details"}
        </Button>
      </div>
    );
  }

  return (
    <div className={"transaction-sign-arbitrary-data-view__container"}>
      <div className={"transaction-sign-arbitrary-data-view__header"}>
        <Button
          customClassName={"transaction-sign-arbitrary-data-view__header__back-button"}
          buttonType={"custom"}
          onClick={handleChangeView}>
          <ArrowLeft />
        </Button>

        <h1 className={"typography--subhead"}>{"Transaction Detail"}</h1>
      </div>

      <div className={"transaction-sign-arbitrary-data-view__account-container"}>
        <AccountListItemContent
          account={accounts[arbitraryData?.signer || ""]}
          shouldDisplayYouTag={true}
        />

        <div className={"transaction-sign-arbitrary-data-view__to"}>
          <p
            className={
              "text--uppercase typography--tagline text-color--gray-lightest transaction-sign-single-view-wallets__to__text"
            }>
            {"To"}
          </p>
        </div>

        <div className={"transaction-sign-arbitrary-data-view__dApp"}>
          <img
            className={"transaction-sign-arbitrary-data-view__account-container__favicon"}
            src={currentSession?.favicon}
            alt={currentSession?.title}
            width={32}
            height={32}
          />

          <span className={"typography--body"}>{currentSession?.url}</span>
        </div>
      </div>

      <List
        customClassName={"transaction-sign-arbitrary-data-view__list"}
        items={[
          {title: "Amount", description: `${ALGO_UNIT}0`},
          {title: "Network Fee", description: `${ALGO_UNIT}0`},
          {title: "Transaction Type", description: "Arbitrary Data"},
          {title: "Data", description: uint8ArrayToString(data.data)}
        ]}>
        {({title, description}) => (
          <ListItem customClassName={"transaction-sign-arbitrary-data-view__list-item"}>
            <p className={"text-color--gray-light"}>{title}</p>

            <p
              className={
                "typography--medium-body transaction-sign-arbitrary-data-view__list-item-description"
              }>
              {description}
            </p>
          </ListItem>
        )}
      </List>

      <div
        className={"transaction-sign-arbitrary-data-view__txn-tag typography--caption"}>
        {"Raw Transaction"}
      </div>
    </div>
  );

  function handleChangeView() {
    dispatchTransactionPageAction({
      type: "SET_FORM_VALUE",
      payload: {transactionSignView: "txn-detail-summary"}
    });
  }
}

export default TransactionSignArbitraryDataView;
