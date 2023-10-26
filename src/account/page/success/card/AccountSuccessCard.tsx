import {ReactComponent as QRCodeIcon} from "../../../../core/ui/icons/qr-code.svg";
import {ReactComponent as ExportIcon} from "../../../../core/ui/icons/export.svg";

import "./_account-success-card.scss";

import {useEffect, useState} from "react";

import {useAppContext} from "../../../../core/app/AppContext";
import {useModalDispatchContext} from "../../../../component/modal/context/ModalContext";
import {trimAccountAddress, trimAccountName} from "../../../util/accountUtils";
import ClipboardButton from "../../../../component/clipboard/button/ClipboardButton";
import Button from "../../../../component/button/Button";
import AccountShowQRModal, {
  ACCOUNT_SHOW_QR_MODAL_ID
} from "../../../../overview/page/show-qr/AccountShowQR";
import LinkButton from "../../../../component/button/LinkButton";
import {defaultPriceFormatter} from "../../../../core/util/number/numberUtils";
import {ALGO_UNIT} from "../../../../core/ui/typography/typographyConstants";
import {getPeraExplorerLink} from "../../../../core/util/pera/explorer/getPeraExplorerLink";
import AddFundsButton from "../../../../add-funds/button/AddFundsButton";
import {getPortfolioOverviewData} from "../../../../overview/util/portfolioOverviewUtils";

interface AccountSuccessCardProps {
  account: AppDBAccount;
}

function AccountSuccessCard({account}: AccountSuccessCardProps) {
  const {
    state: {algoPrice, preferredNetwork}
  } = useAppContext();
  const dispatchModalStateAction = useModalDispatchContext();
  const {algoFormatter, usdFormatter} = defaultPriceFormatter();
  const {address, name: accountName} = account;
  const [addedAccountOverview, setAddedAccountOverview] = useState<
    Pick<PortfolioOverview, "portfolio_value_usd" | "portfolio_value_algo"> | undefined
  >();

  useEffect(() => {
    const abortController = new AbortController();

    getPortfolioOverviewData({
      addresses: [account.address],
      abortSignal: abortController.signal,
      algoPrice: algoPrice!,
      accounts: {}
    }).then(({portfolio_value_algo, portfolio_value_usd}) =>
      setAddedAccountOverview({portfolio_value_usd, portfolio_value_algo})
    );

    return () => {
      abortController.abort();
    };
  }, [account.address, algoPrice]);

  return (
    <div
      className={
        "account-success-card-container animation--show-up animation--show-up--delay--10"
      }>
      <div className={"account-success-card__summary"}>
        <div className={"account-success-card__summary-value"}>
          <p className={"typography--body text-color--gray"}>{"Account value"}</p>

          <p
            className={
              "typography--h3 text-color--main account-success-card__summary__main-info"
            }>
            {addedAccountOverview?.portfolio_value_usd
              ? `${ALGO_UNIT}${algoFormatter(
                  Number(addedAccountOverview.portfolio_value_algo || "0.00")
                )}`
              : "-"}
          </p>

          <p className={"typoraphy--secondary-body text-color--gray"}>
            {addedAccountOverview?.portfolio_value_usd
              ? usdFormatter(parseFloat(addedAccountOverview.portfolio_value_usd), {
                  minimumFractionDigits: 2
                })
              : "-"}
          </p>

          <AddFundsButton
            customClassName={"account-success-card__summary-value__add-funds-cta"}
            size={"large"}
            accountAddress={account.address}
          />
        </div>

        <div className={"account-success-card__summary-address"}>
          <p className={"typography--body text-color--gray"}>{"Account address"}</p>

          <p
            className={
              "typography--h3 text-color--main account-success-card__summary__main-info"
            }>
            {trimAccountAddress(address)}
          </p>

          <p className={"typoraphy--secondary-body text-color--gray"}>
            {trimAccountName(accountName)}
          </p>

          <div className={"account-success-card__summary-address__button-group"}>
            <ClipboardButton
              size={"medium"}
              textToCopy={address}
              buttonType={"light"}
              customClassName={"account-success-card__summary-address__copy-button"}>
              {"Copy"}
            </ClipboardButton>

            <Button
              onClick={handleDisplayQRCodeModal}
              buttonType={"light"}
              customClassName={"account-success-card__summary-address__qr-button"}>
              <QRCodeIcon
                className={"account-success-card__qr-button__icon"}
                width={16}
              />
              {"Generate QR"}
            </Button>
          </div>
        </div>
      </div>

      <div className={"account-success-card__pera-explorer"}>
        <p className={"typography--body text-color--gray"}>
          {"See your account in more detail"}
        </p>

        <p
          className={
            "typography--h3 text-color--gray account-success-card__pera-explorer-text"
          }>
          {"on Pera Explorer"}
        </p>

        <LinkButton
          to={getPeraExplorerLink({
            id: address,
            network: preferredNetwork,
            type: "account-detail"
          })}
          external={true}
          buttonType={"light"}
          size={"large"}
          customClassName={"account-success-card__pera-explorer-link"}>
          {"View on Pera Explorer"}

          <ExportIcon width={20} />
        </LinkButton>
      </div>
    </div>
  );

  function handleDisplayQRCodeModal() {
    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: ACCOUNT_SHOW_QR_MODAL_ID,
          modalContentLabel: "Rename account",
          children: (
            <AccountShowQRModal address={address} onClose={handleCloseQRCodeModal} />
          )
        }
      }
    });
  }

  function handleCloseQRCodeModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {
        id: ACCOUNT_SHOW_QR_MODAL_ID
      }
    });
  }
}

export default AccountSuccessCard;
