import {ReactComponent as TipIcon} from "../../../../core/ui/icons/tip.svg";
import {ReactComponent as InfoIcon} from "../../../../core/ui/icons/info.svg";

const BACKUP_INFO_MODAL_ID = "transfer-mobile-info-modal";

const BACKUP_INFO_MODAL_TIPS = [
  {
    id: "sensitive-data-warning",
    icon: <TipIcon width={20} height={20} />,
    description: <p className={"typography--medium-body"}>{"What to expect"}</p>
  },
  {
    id: "qr-generation-info",
    icon: <InfoIcon width={20} height={20} />,
    description: (
      <div className={"backup-info-modal__description"}>
        <p className={"typography--medium-body"}>{"Select your accounts"}</p>

        <p className={"typography--secondary-body text-color--gray"}>
          {"Select one, some or all of your accounts to be included in your backup file"}
        </p>
      </div>
    )
  },
  {
    id: "qr-access-info",
    icon: <InfoIcon width={20} height={20} />,
    description: (
      <div className={"backup-info-modal__description"}>
        <p className={"typography--medium-body"}>{"Store your 12-word key"}</p>

        <p className={"typography--secondary-body text-color--gray"}>
          {"Record or save your 12-word key securely"}
        </p>
      </div>
    )
  },
  {
    id: "qr-scan-info",
    icon: <InfoIcon width={20} height={20} />,
    description: (
      <div className={"backup-info-modal__description"}>
        <p className={"typography--medium-body"}>{"Save your backup file"}</p>

        <p className={"typography--secondary-body text-color--gray"}>
          {"Download your backup to a secure location on your device"}
        </p>
      </div>
    )
  }
];

export {BACKUP_INFO_MODAL_ID, BACKUP_INFO_MODAL_TIPS};
