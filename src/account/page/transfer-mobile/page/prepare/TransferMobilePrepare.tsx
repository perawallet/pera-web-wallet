import "./_transfer-mobile-prepare.scss";

import {ReactComponent as PeraTransferIcon} from "../../../../../core/ui/icons/pera-transfer.svg";

import {useNavigate} from "react-router-dom";

import GoBackButton from "../../../../../component/go-back-button/GoBackButton";
import InfoBox from "../../../../../component/info-box/InfoBox";
import ROUTES from "../../../../../core/route/routes";
import Button from "../../../../../component/button/Button";

function TransferMobilePrepare() {
  const navigate = useNavigate();

  return (
    <div className={"transfer-mobile"}>
      <GoBackButton />

      <PeraTransferIcon className={"transfer-mobile__icon"} />

      <h2 className={"transfer-mobile__title typography--h2"}>
        {"Transfer your accounts to"}
        <br />
        {"Pera Mobile"}
      </h2>

      <p className={"text-color--gray-light"}>
        {"You can transfer all your accounts at once to your Pera Wallet Mobile."}
      </p>

      <InfoBox
        className={"transfer-mobile__info-box"}
        title={"You are about to display sensitive data"}
        infoText={
          "You are about to generate a QR code which contains the private keys of your Algorand accounts. A person who scans this QR code can gain full access to your accounts. This QR should only be scanned by you on your own Pera Mobile device."
        }
      />

      <Button
        size={"large"}
        onClick={handleStartTransferMobile}
        customClassName={"transfer-mobile__cta"}>
        {"I understand, proceed"}
      </Button>
    </div>
  );

  function handleStartTransferMobile() {
    navigate(ROUTES.TRANSFER.SELECT_ACCOUNTS.ROUTE);
  }
}

export default TransferMobilePrepare;
