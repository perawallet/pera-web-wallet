import "./_account-import-ledger-landing.scss";

import {ReactComponent as LedgerIcon} from "../../../../../core/ui/icons/ledger.svg";
import {ReactComponent as USBIcon} from "../../../../../core/ui/icons/usb.svg";
import {ReactComponent as BluetoothIcon} from "../../../../../core/ui/icons/bluetooth.svg";
import {ReactComponent as InfoIcon} from "../../../../../core/ui/icons/info.svg";

import Button from "../../../../../component/button/Button";
import Tooltip from "../../../../../component/tooltip/Tooltip";

function AccountImportLedgerLanding({
  handleSelectLedgerType
}: {
  handleSelectLedgerType: (type: "BLUETOOTH" | "USB") => () => void;
}) {
  const isHidSupported = typeof (navigator as any).hid !== "undefined";
  const isBleSupported = typeof navigator.bluetooth !== "undefined";

  return (
    <>
      <div className={"account-import-ledger__pair-options-group"}>
        <a
          rel={"noopener noreferrer"}
          target={"_blank"}
          href={"https://shop.ledger.com/"}
          className={
            "account-import-ledger__ledger-note typography--secondary-bold-body text-color--main"
          }>
          <span className={"account-import-ledger__icon-container"}>
            <LedgerIcon width={16} height={16} />
          </span>

          {"Purchase a Ledger device  →"}
        </a>

        <div className={"account-import-ledger__steps-button-group"}>
          <Tooltip.Optional
            dataFor={"account-import-ledger__usb-tooltip"}
            content={"USB connection is not supported on your browser."}
            withinTooltip={!isHidSupported}>
            <Button
              isDisabled={!isHidSupported}
              customClassName={"account-import-ledger__cta"}
              size={"large"}
              onClick={handleSelectLedgerType("USB")}>
              <USBIcon width={20} height={20} />

              {"Pair with USB"}
            </Button>
          </Tooltip.Optional>

          <Tooltip.Optional
            dataFor={"account-import-ledger__ble-tooltip"}
            content={"Bluetooth is not supported on your browser."}
            withinTooltip={!isBleSupported}>
            <Button
              isDisabled={!isBleSupported}
              buttonType={"secondary"}
              customClassName={"account-import-ledger__cta"}
              size={"large"}
              onClick={handleSelectLedgerType("BLUETOOTH")}>
              <BluetoothIcon width={20} height={20} />

              {"Pair with Bluetooth"}
            </Button>
          </Tooltip.Optional>
        </div>
      </div>

      <p
        className={
          "account-import-ledger__info-box typography--caption text-color--gray"
        }>
        <InfoIcon width={16} height={16} />

        {"Bluetooth only supported on Ledger Nano X"}
      </p>
    </>
  );
}

export default AccountImportLedgerLanding;
