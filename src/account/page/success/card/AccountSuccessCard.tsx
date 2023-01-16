import {ReactComponent as QRCodeIcon} from "../../../../core/ui/icons/qr-code.svg";
import {ReactComponent as PlusIcon} from "../../../../core/ui/icons/plus.svg";
import {ReactComponent as ExportIcon} from "../../../../core/ui/icons/export.svg";

import "./_account-success-card.scss";

import {useAppContext} from "../../../../core/app/AppContext";
import {useModalDispatchContext} from "../../../../component/modal/context/ModalContext";
import {
  getLastAccountAddress,
  trimAccountAddress,
  trimAccountName
} from "../../../util/accountUtils";
import ClipboardButton from "../../../../component/clipboard/button/ClipboardButton";
import Button from "../../../../component/button/Button";
import AccountShowQRModal, {
  ACCOUNT_SHOW_QR_MODAL_ID
} from "../../../../overview/page/show-qr/AccountShowQR";
import {usePortfolioContext} from "../../../../overview/context/PortfolioOverviewContext";
import LinkButton from "../../../../component/button/LinkButton";
import {defaultPriceFormatter} from "../../../../core/util/number/numberUtils";
import {ALGO_UNIT} from "../../../../core/ui/typography/typographyConstants";
import {getPeraExplorerLink} from "../../../../core/util/pera/explorer/getPeraExplorerLink";
import MoonPayModal, {
  MOON_PAY_MODAL_ID
} from "../../../../core/integrations/moon-pay/modal/MoonPayModal";
import {AccountSuccessPageProps} from "../AccountSuccessPage";

interface AccountSuccessCardProps {
  type: AccountSuccessPageProps["type"];
}

function AccountSuccessCard({type}: AccountSuccessCardProps) {
  const {
    state: {accounts, preferredNetwork}
  } = useAppContext();
  const dispatchModalStateAction = useModalDispatchContext();
  const {algoFormatter, usdFormatter} = defaultPriceFormatter();
  const address = getLastAccountAddress(accounts);
  const portfolioOverview = usePortfolioContext();
  const accountPortfolio = portfolioOverview?.accounts.find(
    (account) => account.address === address
  );

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
            }>{`${ALGO_UNIT}${algoFormatter(
            Number(accountPortfolio?.total_algo_value || "0.00")
          )}`}</p>

          <p className={"typoraphy--secondary-body text-color--gray"}>
            {accountPortfolio?.total_usd_value
              ? usdFormatter(parseFloat(accountPortfolio.total_usd_value), {
                  minimumFractionDigits: 2
                })
              : "-"}
          </p>

          <Button
            size={"large"}
            onClick={handleAddFundsClick}
            customClassName={"account-success-card__summary-value__add-funds-cta"}>
            <PlusIcon />

            {"Add funds"}
          </Button>
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
            {trimAccountName(accounts[address].name)}
          </p>

          <div className={"account-success-card__summary-address__button-group"}>
            <ClipboardButton
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
              {"Generate QR Code"}
            </Button>
          </div>
        </div>
      </div>

      {type === "IMPORT" && (
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
      )}
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

  function handleAddFundsClick() {
    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: MOON_PAY_MODAL_ID,
          modalContentLabel: "Add funds via MoonPay",
          customClassName: "moon-pay-modal-container",
          children: <MoonPayModal address={address} onClose={handleCloseMoonPayModal} />
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

  function handleCloseMoonPayModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {
        id: MOON_PAY_MODAL_ID
      }
    });
  }
}

export default AccountSuccessCard;
